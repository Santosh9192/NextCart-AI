from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Product, User, Wishlist
from ..schemas import WishlistAddIn
from ..serializers import serialize_wishlist

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("/")
def get_wishlist(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == user.id)
        .order_by(Wishlist.id.desc())
        .all()
    )
    return [serialize_wishlist(item) for item in items]


@router.post("/")
def add_to_wishlist(
    body: WishlistAddIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.get(Product, body.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user.id,
            Wishlist.product_id == body.product_id,
        )
        .first()
    )
    if existing:
        return serialize_wishlist(existing)
    item = Wishlist(user_id=user.id, product_id=body.product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return serialize_wishlist(item)


@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user.id,
            Wishlist.product_id == product_id,
        )
        .first()
    )
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Removed from wishlist"}
