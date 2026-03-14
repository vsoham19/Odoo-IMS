from pydantic import BaseModel, EmailStr
from typing import Optional

# -----------------------------
# Auth Schemas
# -----------------------------
class UserCreate(BaseModel):
    email: str # in production use EmailStr, but str for simplicity here if email-validator is not installed
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

# -----------------------------
# Product Schemas
# -----------------------------
class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str


# -----------------------------
# Warehouse Schemas
# -----------------------------
class WarehouseCreate(BaseModel):
    name: str
    location: str


# -----------------------------
# Supplier Schemas
# -----------------------------
class SupplierCreate(BaseModel):
    name: str
    contact: str


# -----------------------------
# Inventory Schemas
# -----------------------------
class InventoryCreate(BaseModel):
    product_id: int
    warehouse_id: int
    quantity: int


# -----------------------------
# Stock Transfer
# -----------------------------
class StockTransfer(BaseModel):
    product_id: int
    from_warehouse: int
    to_warehouse: int
    quantity: int


# -----------------------------
# Stock Delivery
# -----------------------------
class StockDelivery(BaseModel):
    product_id: int
    warehouse_id: int
    quantity: int

class OrderCreate(BaseModel):
    product_id: int
    warehouse_id: int
    quantity: int