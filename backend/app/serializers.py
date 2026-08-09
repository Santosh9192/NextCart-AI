from .models import Cart, Category, Order, Product, User, Wishlist


def serialize_image_urls(product: Product) -> list[dict]:
    return [
        {"id": img.id, "product_id": img.product_id, "image_url": img.image_url}
        for img in product.images
    ]


def serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "brand": product.brand,
        "price": product.price,
        "discount": product.discount,
        "sku": product.sku,
        "quantity": product.quantity,
        "category_id": product.category_id,
        "category_name": product.category.name if product.category else None,
        "featured": product.featured,
        "is_active": product.is_active,
        "image_url": product.image_url,
        "images": serialize_image_urls(product),
        "average_rating": product.avg_rating,
        "total_reviews": product.total_reviews,
        "created_at": product.created_at.isoformat() if product.created_at else None,
    }


def serialize_category(category: Category, product_count: int = 0) -> dict:
    return {
        "id": category.id,
        "name": category.name,
        "description": category.description,
        "slug": category.slug,
        "is_active": category.is_active,
        "product_count": product_count,
        "created_at": category.created_at.isoformat() if category.created_at else None,
    }


def serialize_cart_item(item) -> dict:
    product = item.product
    return {
        "id": item.id,
        "cart_id": item.cart_id,
        "product_id": item.product_id,
        "quantity": item.quantity,
        "price": item.price,
        "product": serialize_product(product) if product else None,
    }


def serialize_cart(cart: Cart) -> dict:
    return {
        "id": cart.id,
        "user_id": cart.user_id,
        "total_price": cart.total_price,
        "created_at": cart.created_at.isoformat() if cart.created_at else None,
        "updated_at": cart.updated_at.isoformat() if cart.updated_at else None,
        "items": [serialize_cart_item(item) for item in cart.items],
    }


def serialize_order_item(item) -> dict:
    return {
        "id": item.id,
        "order_id": item.order_id,
        "product_id": item.product_id,
        "quantity": item.quantity,
        "price": item.price,
    }


def serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "user_id": order.user_id,
        "total_amount": order.total_amount,
        "order_status": order.order_status,
        "payment_status": order.payment_status,
        "shipping_address": order.shipping_address,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [serialize_order_item(item) for item in order.items],
        "customer_name": order.user.full_name if order.user else None,
        "customer_email": order.user.email if order.user else None,
    }


def serialize_wishlist(wishlist: Wishlist) -> dict:
    return {
        "id": wishlist.id,
        "user_id": wishlist.user_id,
        "product_id": wishlist.product_id,
        "created_at": wishlist.created_at.isoformat() if wishlist.created_at else None,
        "product": serialize_product(wishlist.product) if wishlist.product else None,
    }


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "full_name": user.full_name,
        "name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "role_name": user.role,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
