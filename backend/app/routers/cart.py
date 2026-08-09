from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Cart, CartItem, Product, User
from ..schemas import CartAddIn, CartUpdateIn
from ..serializers import serialize_cart

router = APIRouter(prefix="/cart", tags=["cart"])


def _get_or_create_cart(db: Session, user: User) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(user_id=user.id, total_price=0.0)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _recalculate(cart: Cart, db: Session) -> None:
    cart.total_price = sum(
        (item.price - (item.price * (item.product.discount or 0)) / 100) * item.quantity
        for item in cart.items
        if item.product
    )
    db.commit()
    db.refresh(cart)


def _cart_response(cart: Cart):
    return serialize_cart(cart)


@router.get("/")
def get_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user)
    return _cart_response(cart)


@router.post("/add")
def add_to_cart(
    body: CartAddIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.get(Product, body.product_id)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    cart = _get_or_create_cart(db, user)
    item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id)
        .first()
    )
    if item:
        item.quantity += max(body.quantity, 1)
        item.price = product.price
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=max(body.quantity, 1),
            price=product.price,
        )
        db.add(item)
    _recalculate(cart, db)
    return _cart_response(cart)


@router.put("/{product_id}")
def update_cart_item(
    product_id: int,
    body: CartUpdateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user)
    item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not in cart",
        )
    if body.quantity < 1:
        db.delete(item)
    else:
        item.quantity = body.quantity
    _recalculate(cart, db)
    return _cart_response(cart)


@router.delete("/{product_id}")
def remove_cart_item(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user)
    item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        .first()
    )
    if item:
        db.delete(item)
    _recalculate(cart, db)
    return _cart_response(cart)


@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user)
    for item in list(cart.items):
        db.delete(item)
    _recalculate(cart, db)
    return _cart_response(cart)
