from pydantic import BaseModel, Field
from typing import Optional

class ProductCreate(BaseModel):
    name: str = Field(..., description="Name of the product")
    description: Optional[str] = Field(None, description="Detailed description")
    price: float = Field(..., description="Selling price of the product")
    sku: str = Field(..., description="Stock Keeping Unit (unique identifier)")

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    sku: str
    stock_quantity: int

    class Config:
        from_attributes = True
