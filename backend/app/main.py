import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS, UPLOAD_DIR
from .database import Base, SessionLocal, engine
from .demo_data import seed_demo_data
from .routers import admin, auth, cart, categories, orders, products, wishlist
from .seed import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NextCart AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded product images at /uploads/...
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(wishlist.router)
app.include_router(admin.router)


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
        seed_demo_data(db)
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "service": "nextcart-ai-api"}
