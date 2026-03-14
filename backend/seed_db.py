import os
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models, schemas
import datetime

def seed_database():
    print("Dropping existing tables...")
    models.Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    print("Seeding database...")
    
    # Create Products
    products_data = [
        models.Product(name="Wireless Headphones", sku="WH-100", category="Electronics"),
        models.Product(name="Mechanical Keyboard", sku="MK-200", category="Electronics"),
        models.Product(name="Gaming Mouse", sku="GM-300", category="Electronics"),
        models.Product(name="Ergonomic Chair", sku="EC-400", category="Furniture"),
        models.Product(name="USB-C Hub", sku="UH-500", category="Accessories")
    ]
    db.add_all(products_data)
    db.commit()
    
    # Create Warehouses
    wh1 = models.Warehouse(name="Main Warehouse", location="New York")
    db.add(wh1)
    db.commit()
    
    # Create Inventory Items
    invItems = [
        models.Inventory(product_id=products_data[0].id, warehouse_id=wh1.id, quantity=150),
        models.Inventory(product_id=products_data[1].id, warehouse_id=wh1.id, quantity=50),
        models.Inventory(product_id=products_data[4].id, warehouse_id=wh1.id, quantity=5), # Low stock
    ]
    db.add_all(invItems)
    db.commit()
    
    # Create Deliveries
    deliveries = [
        models.StockMovement(product_id=products_data[0].id, warehouse_id=wh1.id, movement_type="DELIVERY", quantity=10),
        models.StockMovement(product_id=products_data[1].id, warehouse_id=wh1.id, movement_type="DELIVERY", quantity=5),
        models.StockMovement(product_id=products_data[2].id, warehouse_id=wh1.id, movement_type="DELIVERY", quantity=2)
    ]
    db.add_all(deliveries)
    db.commit()
    
    # Create Receipts
    receipts = [
        models.StockMovement(product_id=products_data[3].id, warehouse_id=wh1.id, movement_type="RECEIPT", quantity=20),
        models.StockMovement(product_id=products_data[4].id, warehouse_id=wh1.id, movement_type="RECEIPT", quantity=50)
    ]
    db.add_all(receipts)
    db.commit()

    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_database()
