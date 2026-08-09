"""Generates realistic demo data so the admin dashboard looks alive.

Creates 20 customer accounts and ~65 orders spread over the last 30 days,
with varied statuses, payment states, per-day revenue and stock decrements.
Idempotent: skips entirely if the marker customer already exists.
Gate with SEED_DEMO_DATA=false to disable.
"""

import os
import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from .models import Order, OrderItem, Product, User
from .security import hash_password

ENABLED = os.getenv("SEED_DEMO_DATA", "true").lower() != "false"

MARKER_EMAIL = "customer01@nextcart.ai"

FIRST_NAMES = [
    "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Arjun", "Kavya",
    "Rahul", "Ishita", "Aditya", "Pooja", "Karan", "Meera", "Ravi", "Divya",
    "Sanjay", "Neha", "Manish", "Swati",
]
LAST_NAMES = [
    "Sharma", "Patel", "Mehta", "Iyer", "Singh", "Reddy", "Nair", "Gupta",
    "Verma", "Bose", "Kumar", "Joshi", "Malhotra", "Kapoor", "Sharma", "Menon",
    "Pillai", "Agarwal", "Tiwari", "Desai",
]
CITIES = [
    ("Bengaluru", "560001"), ("Mumbai", "400001"), ("Delhi", "110001"),
    ("Hyderabad", "500001"), ("Chennai", "600001"), ("Pune", "411001"),
    ("Kolkata", "700001"), ("Ahmedabad", "380001"), ("Jaipur", "302001"),
    ("Kochi", "682001"),
]
STREETS = ["MG Road", "Park Street", "Ring Road", "Lake View", "Gandhi Nagar",
           "Church Street", "Residency Road", "Banjara Hills", "Anna Salai", "FC Road"]

STATUSES = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"]
# Weighted toward a healthy pipeline: mostly delivered, some in progress, few cancelled
STATUS_WEIGHTS = [1, 1, 2, 5, 1]

ADDRESS_SUFFIXES = ["", ", Near City Mall", ", 3rd Floor", ", Apartment 12B", ""]


def _naive_utc_now():
    return datetime.utcnow()


def _random_name(rng: random.Random):
    return f"{rng.choice(FIRST_NAMES)} {rng.choice(LAST_NAMES)}"


def _random_phone(rng: random.Random):
    return f"+91 {rng.randint(70000, 99999)} {rng.randint(10000, 99999)}"


def _random_address(rng: random.Random):
    city, pincode = rng.choice(CITIES)
    return f"{rng.randint(1, 220)} {rng.choice(STREETS)}, {city} {pincode}{rng.choice(ADDRESS_SUFFIXES)}"


def seed_demo_data(db: Session) -> None:
    if not ENABLED:
        return
    if db.query(User).filter(User.email == MARKER_EMAIL).first():
        return  # already seeded

    rng = random.Random(42)  # deterministic for reproducibility
    products = db.query(Product).filter(Product.is_active.is_(True)).all()
    if not products:
        return

    now = _naive_utc_now()

    # --- Create 20 demo customers, joined over the last ~60 days ---
    users = []
    for i in range(1, 21):
        name = _random_name(rng)
        email = f"customer{i:02d}@nextcart.ai"
        joined = now - timedelta(days=rng.randint(1, 60), hours=rng.randint(0, 23))
        user = User(
            full_name=name,
            email=email,
            phone=_random_phone(rng),
            password=hash_password("customer123"),
            role="Customer",
            is_active=True,
            is_verified=rng.random() < 0.9,
            created_at=joined,
        )
        db.add(user)
        users.append(user)
    db.flush()

    # --- Create ~65 orders spread over the last 30 days ---
    for _ in range(65):
        customer = rng.choice(users)
        status = rng.choices(STATUSES, weights=STATUS_WEIGHTS, k=1)[0]
        payment = "Paid" if status in ("Delivered", "Shipped", "Confirmed") else rng.choice(["Pending", "Paid"])

        placed_at = now - timedelta(
            days=rng.randint(0, 29),
            hours=rng.randint(0, 23),
            minutes=rng.randint(0, 59),
        )

        order = Order(
            user_id=customer.id,
            order_status=status,
            payment_status=payment,
            shipping_address=_random_address(rng),
            created_at=placed_at,
        )
        db.add(order)
        db.flush()

        # 1-4 distinct products per order (capped by available products)
        picked = rng.sample(products, k=min(rng.randint(1, 4), len(products)))
        total = 0.0
        for product in picked:
            qty = rng.randint(1, 3)
            unit_price = product.price - (product.price * (product.discount or 0)) / 100
            line_total = unit_price * qty
            total += line_total
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=qty,
                    price=unit_price,
                )
            )
            # Decrement stock so inventory figures look real (never below 0)
            if product.quantity is not None:
                product.quantity = max(product.quantity - qty, 0)

        order.total_amount = round(total, 2)

    db.commit()
