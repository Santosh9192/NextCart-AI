from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Cart, Order, OrderItem, Product, User
from ..schemas import CheckoutIn
from ..serializers import serialize_order

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/")
def my_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order).filter(Order.user_id == user.id).order_by(Order.id.desc()).all()
    )
    return [serialize_order(o) for o in orders]


@router.post("/checkout")
def checkout(
    body: CheckoutIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not body.shipping_address.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Shipping address is required",
        )
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    order = Order(
        user_id=user.id,
        order_status="Placed",
        payment_status="Pending",
        shipping_address=body.shipping_address.strip(),
    )
    db.add(order)
    db.flush()

    total = 0.0
    for item in cart.items:
        product = item.product
        if not product:
            continue
        unit_price = product.price - (product.price * (product.discount or 0)) / 100
        line_total = unit_price * item.quantity
        total += line_total
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=unit_price,
        )
        db.add(order_item)
        if product.quantity is not None:
            product.quantity = max(product.quantity - item.quantity, 0)

    order.total_amount = total
    # Empty the cart
    for item in list(cart.items):
        db.delete(item)
    cart.total_price = 0.0

    db.commit()
    db.refresh(order)
    return serialize_order(order)
