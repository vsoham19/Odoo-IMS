from typing import List
from datetime import datetime
from schemas.product_schema import ProductCreate, ProductResponse
from schemas.inventory_schema import (
    ReceiptCreate,
    DeliveryCreate,
    TransferCreate,
    AdjustmentCreate,
    StockMoveResponse
)

# Placeholder: Database Session Reference
# From sqlalchemy.orm import Session
# db: Session = None

def create_product(product: ProductCreate) -> ProductResponse:
    """
    Business logic to create a new product.
    - validate sku doesn't exist
    - create product in db
    - return product
    """
    # Placeholder:
    # existing_product = db.query(ProductModel).filter_by(sku=product.sku).first()
    # if existing_product: raise ValueError("SKU already exists")
    # new_product = ProductModel(**product.dict())
    # db.add(new_product)
    # db.commit()
    # db.refresh(new_product)

    return ProductResponse(
        id=1,
        name=product.name,
        description=product.description,
        price=product.price,
        sku=product.sku,
        stock_quantity=0
    )


def get_products() -> List[ProductResponse]:
    """
    Retrieve all products.
    """
    # Placeholder:
    # products = db.query(ProductModel).all()
    # return products
    return []


def process_receipt(receipt: ReceiptCreate) -> dict:
    """
    Process incoming stock.
    - validate product exists
    - increase stock quantity
    - create stock ledger entry for receipt
    """
    # Placeholder:
    # product = db.query(ProductModel).filter_by(id=receipt.product_id).first()
    # if not product: raise ValueError("Product not found")
    # product.stock_quantity += receipt.quantity
    # stock_move = StockMoveModel(
    #     product_id=receipt.product_id,
    #     move_type="receipt",
    #     quantity=receipt.quantity,
    #     notes=receipt.notes,
    #     timestamp=datetime.utcnow()
    # )
    # db.add(stock_move)
    # db.commit()

    return {"message": "Receipt processed successfully"}


def process_delivery(delivery: DeliveryCreate) -> dict:
    """
    Process outgoing stock.
    - check stock availability
    - decrease stock
    - create ledger entry for delivery
    """
    # Placeholder:
    # product = db.query(ProductModel).filter_by(id=delivery.product_id).first()
    # if not product: raise ValueError("Product not found")
    # if product.stock_quantity < delivery.quantity:
    #     raise ValueError("Insufficient stock")
    # product.stock_quantity -= delivery.quantity
    # stock_move = StockMoveModel(
    #     product_id=delivery.product_id,
    #     move_type="delivery",
    #     quantity=delivery.quantity,
    #     notes=delivery.notes,
    #     timestamp=datetime.utcnow()
    # )
    # db.add(stock_move)
    # db.commit()

    return {"message": "Delivery processed successfully"}


def process_transfer(transfer: TransferCreate) -> dict:
    """
    Process stock transfer between locations.
    - record movement between locations
    - overall stock total might be handled separately or unchanged depending on system logic
    """
    # Placeholder:
    # stock_move = StockMoveModel(
    #     product_id=transfer.product_id,
    #     move_type="transfer",
    #     quantity=transfer.quantity,
    #     source_location=transfer.source_location,
    #     destination_location=transfer.destination_location,
    #     notes=transfer.notes,
    #     timestamp=datetime.utcnow()
    # )
    # db.add(stock_move)
    # db.commit()

    return {"message": "Transfer processed successfully"}


def process_adjustment(adjustment: AdjustmentCreate) -> dict:
    """
    Process stock adjustments based on physical count.
    - compare counted stock with system stock
    - update stock
    - record adjustment move
    """
    # Placeholder:
    # product = db.query(ProductModel).filter_by(id=adjustment.product_id).first()
    # if not product: raise ValueError("Product not found")
    #
    # current_stock = product.stock_quantity
    # diff = adjustment.counted_quantity - current_stock
    # product.stock_quantity = adjustment.counted_quantity
    #
    # stock_move = StockMoveModel(
    #     product_id=adjustment.product_id,
    #     move_type="adjustment",
    #     quantity=diff,
    #     notes=adjustment.notes,
    #     timestamp=datetime.utcnow()
    # )
    # db.add(stock_move)
    # db.commit()

    return {"message": "Adjustment processed successfully"}


def get_stock_moves() -> List[StockMoveResponse]:
    """
    Retrieve stock movement history.
    """
    # Placeholder:
    # moves = db.query(StockMoveModel).order_by(StockMoveModel.timestamp.desc()).all()
    # return moves
    return []
