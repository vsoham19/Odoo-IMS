from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from . import models, schemas, auth


# USERS
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def generate_otp_for_user(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    otp = str(random.randint(100000, 999999))
    user.otp = otp
    # expiry in 10 mins
    expiry = datetime.utcnow() + timedelta(minutes=10)
    user.otp_expiry = expiry.isoformat()
    db.commit()
    return otp

def verify_otp_and_reset_password(db: Session, data: schemas.OTPVerify):
    user = get_user_by_email(db, data.email)
    if not user or not user.otp:
        return False
    if user.otp != data.otp:
        return False
    if datetime.fromisoformat(user.otp_expiry) < datetime.utcnow():
        return False
    user.password_hash = auth.get_password_hash(data.new_password)
    user.otp = None
    user.otp_expiry = None
    db.commit()
    return True

def create_product(db: Session, product: schemas.ProductCreate):
    obj = models.Product(**product.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_products(db: Session):
    return db.query(models.Product).all()


# WAREHOUSES
def create_warehouse(db: Session, warehouse: schemas.WarehouseCreate):
    obj = models.Warehouse(**warehouse.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_warehouses(db: Session):
    return db.query(models.Warehouse).all()


# SUPPLIERS
def create_supplier(db: Session, supplier: schemas.SupplierCreate):
    obj = models.Supplier(**supplier.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# RECEIVE STOCK
def receive_stock(db: Session, data: schemas.InventoryCreate):

    inventory = models.Inventory(**data.dict())
    db.add(inventory)

    movement = models.StockMovement(
        product_id=data.product_id,
        warehouse_id=data.warehouse_id,
        movement_type="RECEIPT",
        quantity=data.quantity
    )

    db.add(movement)
    db.commit()

    return inventory


# DELIVER STOCK
def deliver_stock(db: Session, data: schemas.StockDelivery):

    inventory = db.query(models.Inventory).filter(
        models.Inventory.product_id == data.product_id,
        models.Inventory.warehouse_id == data.warehouse_id
    ).first()

    inventory.quantity -= data.quantity

    movement = models.StockMovement(
        product_id=data.product_id,
        warehouse_id=data.warehouse_id,
        movement_type="DELIVERY",
        quantity=data.quantity
    )

    db.add(movement)
    db.commit()

    return inventory


# TRANSFER STOCK
def transfer_stock(db: Session, data: schemas.StockTransfer):

    from_inventory = db.query(models.Inventory).filter(
        models.Inventory.product_id == data.product_id,
        models.Inventory.warehouse_id == data.from_warehouse
    ).first()

    to_inventory = db.query(models.Inventory).filter(
        models.Inventory.product_id == data.product_id,
        models.Inventory.warehouse_id == data.to_warehouse
    ).first()

    from_inventory.quantity -= data.quantity
    to_inventory.quantity += data.quantity

    movement = models.StockMovement(
        product_id=data.product_id,
        warehouse_id=data.from_warehouse,
        movement_type="TRANSFER",
        quantity=data.quantity
    )

    db.add(movement)
    db.commit()

    return {"status": "transfer complete"}


# INVENTORY
def get_inventory(db: Session):
    return db.query(models.Inventory).all()


# LOW STOCK
def low_stock(db: Session):
    return db.query(models.Inventory).filter(models.Inventory.quantity < 10).all()


# DASHBOARD
def dashboard(db: Session):

    products = db.query(models.Product).count()
    warehouses = db.query(models.Warehouse).count()
    inventory = db.query(models.Inventory).count()

    return {
        "total_products": products,
        "total_warehouses": warehouses,
        "inventory_records": inventory
    }

def create_order(db: Session, order: schemas.OrderCreate):

    inventory = db.query(models.Inventory).filter(
        models.Inventory.product_id == order.product_id,
        models.Inventory.warehouse_id == order.warehouse_id
    ).first()

    if inventory.quantity < order.quantity:
        return {"error": "Not enough stock"}

    inventory.quantity -= order.quantity

    new_order = models.Order(**order.dict())
    db.add(new_order)

    movement = models.StockMovement(
        product_id=order.product_id,
        warehouse_id=order.warehouse_id,
        movement_type="ORDER",
        quantity=order.quantity
    )

    db.add(movement)
    db.commit()

    return new_order

def low_stock_alert(db: Session):

    items = db.query(models.Inventory).filter(
        models.Inventory.quantity < 10
    ).all()

    return items

def demand_prediction(db: Session, product_id: int):

    movements = db.query(models.StockMovement).filter(
        models.StockMovement.product_id == product_id,
        models.StockMovement.movement_type == "ORDER"
    ).all()

    total = sum(m.quantity for m in movements)

    days = max(len(movements), 1)

    avg_daily_demand = total / days

    prediction = avg_daily_demand * 7

    return {
        "product_id": product_id,
        "avg_daily_demand": avg_daily_demand,
        "predicted_next_week": prediction
    }

def dashboard_stats(db: Session):

    products = db.query(models.Product).count()
    warehouses = db.query(models.Warehouse).count()
    orders = db.query(models.Order).count()
    inventory = db.query(models.Inventory).count()

    return {
        "total_products": products,
        "total_warehouses": warehouses,
        "total_orders": orders,
        "inventory_records": inventory
    }