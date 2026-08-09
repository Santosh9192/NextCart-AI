from pydantic import BaseModel, ConfigDict


class RegisterIn(BaseModel):
    full_name: str
    email: str
    phone: str | None = None
    password: str


class LoginIn(BaseModel):
    email: str
    password: str


class CategoryIn(BaseModel):
    name: str
    description: str | None = None


class ProductIn(BaseModel):
    name: str
    description: str = ""
    brand: str = ""
    price: float = 0.0
    discount: float = 0.0
    sku: str
    quantity: int = 0
    category_id: int | None = None
    featured: bool = False


class CartAddIn(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdateIn(BaseModel):
    quantity: int


class CheckoutIn(BaseModel):
    shipping_address: str = ""


class WishlistAddIn(BaseModel):
    product_id: int


class UserUpdateIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    is_active: bool | None = None
    is_verified: bool | None = None
    role: str | None = None


class OrderStatusIn(BaseModel):
    order_status: str
