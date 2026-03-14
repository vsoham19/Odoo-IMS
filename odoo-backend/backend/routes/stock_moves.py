from fastapi import APIRouter, HTTPException
from utils.response import success_response
from services import inventory_service

router = APIRouter(prefix="/stock-moves", tags=["Stock Move History"])

@router.get("", response_model=dict)
def get_stock_moves():
    try:
        moves = inventory_service.get_stock_moves()
        return success_response(data=moves, message="Stock moves retrieved successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
