from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_admin_user
from ..models import Category, Order, OrderItem, Product, User
from ..schemas import OrderStatusIn, UserUpdateIn
from ..serializers import serialize_order, serialize_product, serialize_user

router = APIRouter(tags=["admin"], dependencies=[Depends(get_admin_user)])


@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    # Use naive UTC to match SQLAlchemy DateTime columns (datetime.utcnow)
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)

    total_users = db.query(func.count(User.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_categories = db.query(func.count(Category.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0

    total_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).scalar() or 0.0
    )
    today_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0.0))
        .filter(Order.created_at >= today_start)
        .scalar()
        or 0.0
    )
    week_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0.0))
        .filter(Order.created_at >= week_start)
        .scalar()
        or 0.0
    )
    avg_order_value = (total_revenue / total_orders) if total_orders else 0.0

    pending_orders = (
        db.query(func.count(Order.id))
        .filter(Order.order_status.in_(["Placed", "Confirmed", "Shipped"]))
        .scalar()
        or 0
    )
    low_stock_products = (
        db.query(func.count(Product.id))
        .filter(Product.quantity < 10, Product.quantity > 0)
        .scalar()
        or 0
    )
    out_of_stock_products = (
        db.query(func.count(Product.id)).filter(Product.quantity <= 0).scalar() or 0
    )

    status_rows = (
        db.query(Order.order_status, func.count(Order.id))
        .group_by(Order.order_status)
        .all()
    )
    order_status_distribution = {s: c for s, c in status_rows}

    latest_orders = (
        db.query(Order).order_by(Order.id.desc()).limit(5).all()
    )
    recent_users = db.query(User).order_by(User.id.desc()).limit(5).all()

    # Last 30 days revenue per day
    month_start = now - timedelta(days=29)
    daily_rows = (
        db.query(
            func.date(Order.created_at).label("day"),
            func.coalesce(func.sum(Order.total_amount), 0.0).label("revenue"),
        )
        .filter(Order.created_at >= month_start)
        .group_by("day")
        .order_by("day")
        .all()
    )
    monthly_revenue = [
        {"date": day.isoformat(), "revenue": float(rev)}
        for day, rev in daily_rows
    ]

    top_rows = (
        db.query(
            OrderItem.product_id,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.price * OrderItem.quantity).label("revenue"),
        )
        .group_by(OrderItem.product_id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )
    product_names = {
        p.id: p.name
        for p in db.query(Product).filter(
            Product.id.in_([r[0] for r in top_rows])
        ).all()
    } if top_rows else {}
    top_products = [
        {
            "id": pid,
            "name": product_names.get(pid, f"Product #{pid}"),
            "total_sold": int(sold),
            "revenue": float(rev or 0.0),
        }
        for pid, sold, rev in top_rows
    ]

    cat_rows = (
        db.query(Category.name, func.count(Product.id))
        .join(Product, Product.category_id == Category.id)
        .group_by(Category.id)
        .order_by(func.count(Product.id).desc())
        .all()
    )
    category_breakdown = [{"name": name, "product_count": count} for name, count in cat_rows]

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_categories": total_categories,
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "today_revenue": float(today_revenue),
        "week_revenue": float(week_revenue),
        "avg_order_value": float(avg_order_value),
        "pending_orders": pending_orders,
        "low_stock_products": low_stock_products,
        "out_of_stock_products": out_of_stock_products,
        "order_status_distribution": order_status_distribution,
        "latest_orders": [serialize_order(o) for o in latest_orders],
        "recent_users": [serialize_user(u) for u in recent_users],
        "monthly_revenue": monthly_revenue,
        "top_products": top_products,
        "category_breakdown": category_breakdown,
    }


@router.get("/admin/users")
def admin_users(
    search: str = "",
    role: str = "",
    is_active: bool | None = None,
    is_verified: bool | None = None,
    sort_by: str = "id",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
):
    q = db.query(User)
    if search.strip():
        like = f"%{search.strip()}%"
        q = q.filter(
            or_(
                User.full_name.ilike(like),
                User.email.ilike(like),
                User.phone.ilike(like),
            )
        )
    if role:
        q = q.filter(User.role == role)
    if is_active is not None:
        q = q.filter(User.is_active.is_(is_active))
    if is_verified is not None:
        q = q.filter(User.is_verified.is_(is_verified))

    column = getattr(User, sort_by, User.id)
    q = q.order_by(column.desc() if sort_order == "desc" else column.asc())
    return [serialize_user(u) for u in q.all()]


@router.put("/admin/users/{user_id}")
def update_user(
    user_id: int,
    body: UserUpdateIn,
    db: Session = Depends(get_db),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if body.is_active is not None:
        user.is_active = body.is_active
    if body.is_verified is not None:
        user.is_verified = body.is_verified
    if body.role is not None and body.role in ("Admin", "Customer"):
        user.role = body.role
    db.commit()
    db.refresh(user)
    return serialize_user(user)


@router.get("/admin/orders")
def admin_orders(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    status: str = "",
    payment: str = "",
    sort_by: str = "id",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
):
    q = db.query(Order).join(User, Order.user_id == User.id)
    if search.strip():
        like = f"%{search.strip()}%"
        conditions = [
            User.full_name.ilike(like),
            User.email.ilike(like),
        ]
        if search.strip().isdigit():
            conditions.append(Order.id == int(search.strip()))
        q = q.filter(or_(*conditions))
    if status:
        q = q.filter(Order.order_status == status)
    if payment:
        q = q.filter(Order.payment_status == payment)

    column = getattr(Order, sort_by, Order.id)
    q = q.order_by(column.desc() if sort_order == "desc" else column.asc())
    total = q.count()
    orders = q.offset((max(page, 1) - 1) * limit).limit(limit).all()

    return {
        "orders": [serialize_order(o) for o in orders],
        "total": total,
    }


@router.put("/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    body: OrderStatusIn,
    db: Session = Depends(get_db),
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    order.order_status = body.order_status
    db.commit()
    db.refresh(order)
    return serialize_order(order)


@router.get("/admin/products")
def admin_products(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    category_id: int | None = None,
    brand: str = "",
    featured: bool | None = None,
    is_active: bool | None = None,
    stock_status: str = "",
    sort_by: str = "id",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
):
    q = db.query(Product)
    if search.strip():
        like = f"%{search.strip()}%"
        q = q.filter(
            or_(
                Product.name.ilike(like),
                Product.brand.ilike(like),
                Product.sku.ilike(like),
            )
        )
    if category_id:
        q = q.filter(Product.category_id == category_id)
    if brand:
        q = q.filter(Product.brand.ilike(f"%{brand}%"))
    if featured is not None:
        q = q.filter(Product.featured.is_(featured))
    if is_active is not None:
        q = q.filter(Product.is_active.is_(is_active))
    if stock_status == "low":
        q = q.filter(Product.quantity < 10)

    sort_map = {"average_rating": Product.avg_rating}
    column = sort_map.get(sort_by) or getattr(Product, sort_by, Product.id)
    q = q.order_by(column.desc() if sort_order == "desc" else column.asc())
    total = q.count()
    products = q.offset((max(page, 1) - 1) * limit).limit(limit).all()

    return {
        "products": [serialize_product(p) for p in products],
        "total": total,
    }
