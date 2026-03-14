from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from . import models, schemas, crud, auth
from .email_utils import send_otp_email

app = FastAPI(title="Inventory ERP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"Global Exception caught: {exc}")
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"detail": str(exc)})

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        import jwt
        from jwt import PyJWTError as JWTError
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# ---------------------------------------------------------
# AUTH ENDPOINTS
# ---------------------------------------------------------
@app.post("/auth/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return crud.create_user(db=db, user=user)
    except Exception as e:
        print(f"Error in signup: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/forgot-password")
def forgot_password(req: schemas.OTPRequest, db: Session = Depends(get_db)):
    otp = crud.generate_otp_for_user(db, req.email)
    if not otp:
        return {"message": "If the email exists, an OTP has been sent."}
    
    email_sent = send_otp_email(req.email, otp)
    if not email_sent:
        print(f"OTP for {req.email}: {otp}")
        return {"message": "Email not configured. Check console for dev testing.", "dev_otp": otp}
        
    return {"message": "OTP has been sent to your email."}

@app.post("/auth/reset-password")
def reset_password(req: schemas.OTPVerify, db: Session = Depends(get_db)):
    success = crud.verify_otp_and_reset_password(db, req)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid OTP or OTP expired")
    return {"message": "Password reset successfully"}

# ---------------------------------------------------------
# INVENTORY ENDPOINTS
# ---------------------------------------------------------

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Inventory ERP running"}


@app.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)


@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@app.post("/warehouses")
def create_warehouse(warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    return crud.create_warehouse(db, warehouse)


@app.get("/warehouses")
def get_warehouses(db: Session = Depends(get_db)):
    return crud.get_warehouses(db)


@app.post("/suppliers")
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    return crud.create_supplier(db, supplier)


@app.post("/receive-stock")
def receive_stock(data: schemas.InventoryCreate, db: Session = Depends(get_db)):
    return crud.receive_stock(db, data)


@app.post("/deliver-stock")
def deliver_stock(data: schemas.StockDelivery, db: Session = Depends(get_db)):
    return crud.deliver_stock(db, data)


@app.post("/transfer-stock")
def transfer_stock(data: schemas.StockTransfer, db: Session = Depends(get_db)):
    return crud.transfer_stock(db, data)

@app.get("/movements")
def get_movements(db: Session = Depends(get_db)):
    movements = db.query(models.StockMovement).all()
    # Format to match frontend: date, quantity, product_id
    res = []
    for m in movements:
        res.append({
            "id": m.id,
            "date": "2024-03-20", # placeholder, using dummy since we don't have created_at
            "quantity": m.quantity,
            "product_id": m.product_id,
            "type": m.movement_type
        })
    return res

@app.get("/deliveries")
def get_deliveries(db: Session = Depends(get_db)):
    deliveries = db.query(models.StockMovement).filter(models.StockMovement.movement_type == "DELIVERY").all()
    res = []
    for d in deliveries:
        res.append({
            "id": d.id,
            "status": "Completed" # mock status since we don't have it in schema
        })
    return res

@app.get("/receipts")
def get_receipts(db: Session = Depends(get_db)):
    receipts = db.query(models.StockMovement).filter(models.StockMovement.movement_type == "RECEIPT").all()
    res = []
    for r in receipts:
        res.append({
            "id": r.id,
            "status": "Completed" # mock status
        })
    return res



@app.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    return crud.get_inventory(db)


@app.get("/low-stock")
def low_stock(db: Session = Depends(get_db)):
    return crud.low_stock(db)


@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    stats = crud.dashboard(db)
    stats["trends"] = [
        {"month": "Jan", "stockLevel": 1400, "demand": 800},
        {"month": "Feb", "stockLevel": 1200, "demand": 950},
        {"month": "Mar", "stockLevel": 1500, "demand": 1100},
        {"month": "Apr", "stockLevel": 1300, "demand": 1250},
        {"month": "May", "stockLevel": 1600, "demand": 1400},
        {"month": "Jun", "stockLevel": 1800, "demand": 1550},
    ]
    return stats

@app.post("/orders")
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

@app.get("/alerts/low-stock")
def low_stock(db: Session = Depends(get_db)):
    return crud.low_stock_alert(db)

@app.get("/prediction/{product_id}")
def predict(product_id: int, db: Session = Depends(get_db)):
    return crud.demand_prediction(db, product_id)
