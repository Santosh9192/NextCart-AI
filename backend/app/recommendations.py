"""Lightweight content-based product recommendations.

Computes similarity from category, brand, price proximity and name tokens.
Kept dependency-free so deployment stays fast and reliable (no scikit-learn
needed on the free hosting tier).
"""

from sqlalchemy import func
from sqlalchemy.orm import Session

from .models import Product


def _score(target: Product, candidate: Product) -> float:
    score = 0.0
    if candidate.category_id and candidate.category_id == target.category_id:
        score += 3.0
    if candidate.brand and candidate.brand.lower() == target.brand.lower():
        score += 2.0
    if target.price > 0:
        price_ratio = min(candidate.price, target.price) / max(candidate.price, target.price)
        score += price_ratio * 1.5
    target_tokens = set(target.name.lower().split())
    candidate_tokens = set(candidate.name.lower().split())
    overlap = len(target_tokens & candidate_tokens)
    score += overlap * 0.5
    return score


def recommend_for_product(db: Session, target: Product, limit: int = 4) -> list[Product]:
    query = db.query(Product).filter(
        Product.is_active.is_(True),
        Product.id != target.id,
    )
    # Prefer same category first, then any products, bounded to keep it cheap.
    same_category = query.filter(Product.category_id == target.category_id).all()
    others = (
        db.query(Product)
        .filter(Product.is_active.is_(True), Product.id != target.id)
        .order_by(func.random())
        .limit(200)
        .all()
    )
    seen = {p.id for p in same_category}
    combined = list(same_category) + [p for p in others if p.id not in seen]
    combined.sort(key=lambda p: _score(target, p), reverse=True)
    return combined[:limit]
