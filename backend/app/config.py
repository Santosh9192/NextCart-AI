import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/nextcart_ai",
)
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Frontend origins allowed by CORS (comma-separated).
# "*" allows everything — fine for a public demo API using Bearer tokens.
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

# Base URL used to build absolute image URLs when needed.
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "")

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
