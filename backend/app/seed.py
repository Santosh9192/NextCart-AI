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
    # name, brand, price, discount, sku, category, quantity, featured, rating, reviews, description, image
    ("Wireless Noise-Cancelling Headphones", "SoundMax", 7999, 20, "SM-HP-001", "Electronics", 25, True, 4.6, 128, "Premium over-ear headphones with active noise cancellation and 30-hour battery life.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"),
    ("Smart LED TV 43 inch", "VisionPro", 28999, 15, "VP-TV-043", "Electronics", 10, True, 4.4, 342, "4K Ultra HD smart television with HDR10+ and built-in streaming apps.", "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80"),
    ("Bluetooth Smartwatch", "PulseFit", 3499, 25, "PF-WT-001", "Electronics", 40, False, 4.2, 205, "Fitness smartwatch with heart-rate monitoring, GPS, and 7-day battery.", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"),
    ("Classic Denim Jacket", "UrbanStyle", 2499, 10, "US-JK-001", "Fashion", 30, True, 4.3, 89, "Timeless blue denim jacket in premium cotton with a tailored fit.", "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80"),
    ("Running Shoes", "SwiftStep", 3999, 30, "SS-SH-001", "Fashion", 50, True, 4.7, 410, "Lightweight running shoes with responsive cushioning and breathable mesh.", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"),
    ("Cotton T-Shirt Pack (3)", "UrbanStyle", 1299, 5, "US-TS-003", "Fashion", 80, False, 4.1, 176, "Pack of three soft combed-cotton t-shirts in assorted colors.", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"),
    ("Non-Stick Cookware Set", "ChefCraft", 5499, 18, "CC-CK-001", "Home & Kitchen", 15, True, 4.5, 231, "10-piece non-stick cookware set with induction-safe bases.", "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80"),
    ("Stainless Steel Water Bottle", "HydroPure", 999, 0, "HP-BT-001", "Home & Kitchen", 100, False, 4.8, 520, "Insulated 750ml bottle keeps drinks cold for 24 hours.", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"),
    ("Espresso Coffee Machine", "BrewMaster", 15999, 12, "BM-ES-001", "Home & Kitchen", 8, False, 4.4, 143, "15-bar espresso machine with milk frother for café-quality coffee.", "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80"),
    ("The Art of Coding (Paperback)", "TechPress", 799, 20, "TP-BK-001", "Books", 60, True, 4.9, 310, "A practical guide to writing clean, maintainable code.", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"),
    ("Wireless Earbuds", "SoundMax", 1999, 35, "SM-EB-001", "Electronics", 75, False, 4.3, 640, "True wireless earbuds with charging case and touch controls.", "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80"),
    ("Yoga Mat Pro", "ZenFit", 1499, 15, "ZF-YM-001", "Sports & Fitness", 45, False, 4.6, 197, "Eco-friendly extra-thick yoga mat with alignment lines.", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"),
    ("Adjustable Dumbbell Set", "IronWorks", 8999, 10, "IW-DB-001", "Sports & Fitness", 12, True, 4.7, 88, "Space-saving adjustable dumbbells from 5kg to 25kg per pair.", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80"),
]


def _seed_all(db: Session) -> None:
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
        category_name, quantity, featured, rating, reviews, description, image,
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
            image_url=image,
            category_id=category_map[category_name].id,
            is_active=True,
        )
        db.add(product)

    db.commit()


def seed_database(db: Session) -> None:
    if not db.query(User).first():
        _seed_all(db)

    # Backfill image URLs for products that were seeded before images existed,
    # or that still carry an old placeholder image URL.
    image_by_sku = {
        sku: image
        for (_name, _brand, _price, _discount, sku, _cat, _qty, _f, _r, _rv, _d, image)
        in PRODUCTS
    }
    changed = False
    products = db.query(Product).filter(
        (Product.image_url.is_(None)) | (Product.image_url.like("https://picsum.photos/%"))
    ).all()
    for product in products:
        if product.sku in image_by_sku:
            product.image_url = image_by_sku[product.sku]
            changed = True
    if changed:
        db.commit()
