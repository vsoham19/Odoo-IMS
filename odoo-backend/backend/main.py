from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import (
    products,
    receipts,
    deliveries,
    transfers,
    adjustments,
    stock_moves
)

app = FastAPI(
    title="Inventory Management System API",
    description="Backend API for an Inventory Management System",
    version="1.0.0"
)

# Optional: Add CORS middleware if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(products.router)
app.include_router(receipts.router)
app.include_router(deliveries.router)
app.include_router(transfers.router)
app.include_router(adjustments.router)
app.include_router(stock_moves.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Inventory API is running"}
