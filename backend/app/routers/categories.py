from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_admin_user
from ..models import Category, Product, User
from ..schemas import CategoryIn
from ..serializers import serialize_category

router = APIRouter(prefix="/categories", tags=["categories"])


def _category_counts(db: Session) -> dict[int, int]:
    rows = (
        db.query(Product.category_id, func.count(Product.id))
        .group_by(Product.category_id)
        .all()
    )
    return {cid: count for cid, count in rows if cid is not None}


def _slugify(name: str) -> str:
    return (
        name.lower()
        .strip()
        .replace(" ", "-")
        .replace("&", "and")
        .replace("/", "-")
        .replace("--", "-")
    )


@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    counts = _category_counts(db)
    categories = db.query(Category).order_by(Category.name).all()
    return [
        serialize_category(cat, counts.get(cat.id, 0)) for cat in categories
    ]


@router.post("/")
def create_category(
    body: CategoryIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    if not body.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category name is required",
        )
    slug = _slugify(body.name)
    if db.query(Category).filter(Category.slug == slug).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists",
        )
    cat = Category(name=body.name.strip(), description=body.description, slug=slug)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return serialize_category(cat, 0)


@router.put("/{category_id}")
def update_category(
    category_id: int,
    body: CategoryIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    cat = db.get(Category, category_id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    if body.name.strip():
        cat.name = body.name.strip()
        cat.slug = _slugify(body.name)
    if body.description is not None:
        cat.description = body.description
    db.commit()
    db.refresh(cat)
    counts = _category_counts(db)
    return serialize_category(cat, counts.get(cat.id, 0))


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    cat = db.get(Category, category_id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}
