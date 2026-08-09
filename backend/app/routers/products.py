import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..config import UPLOAD_DIR
from ..database import get_db
from ..deps import get_admin_user
from ..models import Category, Product, ProductImage, User
from ..recommendations import recommend_for_product
from ..schemas import ProductIn
from ..serializers import serialize_product

router = APIRouter(prefix="/products", tags=["products"])


def _paginate_query(query, page: int, limit: int):
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    return items, total


@router.get("/")
def list_products(
    page: int = 1,
    limit: int = 12,
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active.is_(True))
    query = query.order_by(Product.featured.desc(), Product.id.desc())
    products, total = _paginate_query(query, max(page, 1), min(max(limit, 1), 100))
    return {"products": [serialize_product(p) for p in products], "total": total}


@router.get("/search")
def search_products(keyword: str = "", db: Session = Depends(get_db)):
    q = db.query(Product).filter(Product.is_active.is_(True))
    if keyword.strip():
        like = f"%{keyword.strip()}%"
        q = q.filter(
            or_(
                Product.name.ilike(like),
                Product.brand.ilike(like),
                Product.sku.ilike(like),
            )
        )
    products = q.order_by(Product.id.desc()).limit(50).all()
    return [serialize_product(p) for p in products]


@router.get("/suggestions")
def product_suggestions(keyword: str = "", db: Session = Depends(get_db)):
    q = db.query(Product).filter(Product.is_active.is_(True))
    if keyword.strip():
        like = f"%{keyword.strip()}%"
        q = q.filter(
            or_(
                Product.name.ilike(like),
                Product.brand.ilike(like),
                Product.sku.ilike(like),
            )
        )
    products = q.order_by(Product.name).limit(8).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "price": p.price,
            "image_url": p.image_url,
        }
        for p in products
    ]


@router.get("/{product_id}/recommend")
def get_recommendations(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    related = recommend_for_product(db, product, limit=4)
    return [serialize_product(p) for p in related]


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return serialize_product(product)


@router.post("/")
def create_product(
    body: ProductIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    if db.query(Product).filter(Product.sku == body.sku).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SKU {body.sku} already exists",
        )
    if body.category_id:
        category = db.get(Category, body.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found",
            )
    product = Product(
        name=body.name,
        description=body.description,
        brand=body.brand,
        price=body.price,
        discount=body.discount,
        sku=body.sku,
        quantity=body.quantity,
        category_id=body.category_id,
        featured=body.featured,
        is_active=True,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id}


@router.post("/{product_id}/upload-image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{product_id}-{uuid.uuid4().hex[:8]}{ext}"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, filename)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    image_url = f"uploads/{filename}"
    image = ProductImage(product_id=product.id, image_url=image_url)
    db.add(image)
    if not product.image_url:
        product.image_url = image_url
    db.commit()
    db.refresh(product)
    return serialize_product(product)
