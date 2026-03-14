from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReceiptCreate(BaseModel):
    product_id: int = Field(..., description="ID of the product received")
    quantity: int = Field(..., gt=0, description="Amount received")
    supplier: Optional[str] = Field(None, description="Supplier name or identifier")
    notes: Optional[str] = Field(None, description="Additional notes")

class DeliveryCreate(BaseModel):
    product_id: int = Field(..., description="ID of the product being delivered")
    quantity: int = Field(..., gt=0, description="Amount delivered")
    customer: Optional[str] = Field(None, description="Customer name or identifier")
    notes: Optional[str] = Field(None, description="Additional notes")

class TransferCreate(BaseModel):
    product_id: int = Field(..., description="ID of the product to transfer")
    quantity: int = Field(..., gt=0, description="Amount to transfer")
    source_location: str = Field(..., description="Origin location")
    destination_location: str = Field(..., description="Target location")
    notes: Optional[str] = Field(None, description="Additional notes")

class AdjustmentCreate(BaseModel):
    product_id: int = Field(..., description="ID of the product to adjust")
    counted_quantity: int = Field(..., ge=0, description="Actual physical count of the product")
    notes: Optional[str] = Field(None, description="Reason for adjustment")

class StockMoveResponse(BaseModel):
    id: int
    product_id: int
    move_type: str  # e.g., "receipt", "delivery", "transfer", "adjustment"
    quantity: int
    source_location: Optional[str] = None
    destination_location: Optional[str] = None
    timestamp: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True
