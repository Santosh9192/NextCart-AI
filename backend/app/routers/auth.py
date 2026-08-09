from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import LoginIn, RegisterIn
from ..security import create_access_token, hash_password, verify_password
from ..serializers import serialize_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(body: RegisterIn, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = User(
        full_name=body.full_name.strip(),
        email=email,
        phone=body.phone,
        password=hash_password(body.password),
        role="Customer",
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Account created successfully", "id": user.id}


@router.post("/login")
def login(body: LoginIn, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )
    token = create_access_token(user.id, user.role)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return serialize_user(user)
