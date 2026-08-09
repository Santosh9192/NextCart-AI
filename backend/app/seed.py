from sqlalchemy.orm import Session

from .models import Category, Product, User
from .security import hash_password

CATEGORIES = [
    ("Electronics", "Gadgets, devices, and accessories"),
    ("Fashion", "Clothing, footwear, and accessories"),
    ("Home & Kitchen", "Everything for your home"),
    ("Books", "Books, journals, and stationery"),
    ("Sports & Fitness", "Gear for an active lifestyle"),
]

PRODUCTS = [
    # name, brand, price, discount, sku, category, quantity, featured, rating, reviews, description
    ("Wireless Noise-Cancelling Headphones", "SoundMax", 7999, 20, "SM-HP-001", "Electronics", 25, True, 4.6, 128, "Premium over-ear headphones with active noise cancellation and 30-hour battery life."),
    ("Smart LED TV 43 inch", "VisionPro", 28999, 15, "VP-TV-043", "Electronics", 10, True, 4.4, 342, "4K Ultra HD smart television with HDR10+ and built-in streaming apps."),
    ("Bluetooth Smartwatch", "PulseFit", 3499, 25, "PF-WT-001", "Electronics", 40, False, 4.2, 205, "Fitness smartwatch with heart-rate monitoring, GPS, and 7-day battery."),
    ("Classic Denim Jacket", "UrbanStyle", 2499, 10, "US-JK-001", "Fashion", 30, True, 4.3, 89, "Timeless blue denim jacket in premium cotton with a tailored fit."),
    ("Running Shoes", "SwiftStep", 3999, 30, "SS-SH-001", "Fashion", 50, True, 4.7, 410, "Lightweight running shoes with responsive cushioning and breathable mesh."),
    ("Cotton T-Shirt Pack (3)", "UrbanStyle", 1299, 5, "US-TS-003", "Fashion", 80, False, 4.1, 176, "Pack of three soft combed-cotton t-shirts in assorted colors."),
    ("Non-Stick Cookware Set", "ChefCraft", 5499, 18, "CC-CK-001", "Home & Kitchen", 15, True, 4.5, 231, "10-piece non-stick cookware set with induction-safe bases."),
    ("Stainless Steel Water Bottle", "HydroPure", 999, 0, "HP-BT-001", "Home & Kitchen", 100, False, 4.8, 520, "Insulated 750ml bottle keeps drinks cold for 24 hours."),
    ("Espresso Coffee Machine", "BrewMaster", 15999, 12, "BM-ES-001", "Home & Kitchen", 8, False, 4.4, 143, "15-bar espresso machine with milk frother for café-quality coffee."),
    ("The Art of Coding (Paperback)", "TechPress", 799, 20, "TP-BK-001", "Books", 60, True, 4.9, 310, "A practical guide to writing clean, maintainable code."),
    ("Wireless Earbuds", "SoundMax", 1999, 35, "SM-EB-001", "Electronics", 75, False, 4.3, 640, "True wireless earbuds with charging case and touch controls."),
    ("Yoga Mat Pro", "ZenFit", 1499, 15, "ZF-YM-001", "Sports & Fitness", 45, False, 4.6, 197, "Eco-friendly extra-thick yoga mat with alignment lines."),
    ("Adjustable Dumbbell Set", "IronWorks", 8999, 10, "IW-DB-001", "Sports & Fitness", 12, True, 4.7, 88, "Space-saving adjustable dumbbells from 5kg to 25kg per pair."),
]


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    admin = User(
        full_name="NextCart Admin",
        email="admin@nextcart.ai",
        phone="+91 98765 43210",
        password=hash_password("admin123"),
        role="Admin",
        is_active=True,
        is_verified=True,
    )
    db.add(admin)

    category_map = {}
    for name, description in CATEGORIES:
        slug = name.lower().replace(" & ", "-").replace(" ", "-")
        cat = Category(name=name, description=description, slug=slug)
        db.add(cat)
        category_map[name] = cat

    db.flush()

    for (
        name, brand, price, discount, sku,
        category_name, quantity, featured, rating, reviews, description,
    ) in PRODUCTS:
        product = Product(
            name=name,
            brand=brand,
            price=price,
            discount=discount,
            sku=sku,
            quantity=quantity,
            featured=featured,
            avg_rating=rating,
            total_reviews=reviews,
            description=description,
            category_id=category_map[category_name].id,
            is_active=True,
        )
        db.add(product)

    db.commit()
