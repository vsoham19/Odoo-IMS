from fastapi import APIRouter, HTTPException, status
from schemas.inventory_schema import ReceiptCreate
from utils.response import success_response
from services import inventory_service

router = APIRouter(prefix="/receipts", tags=["Receipts (Incoming Stock)"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def process_receipt(receipt: ReceiptCreate):
    try:
        result = inventory_service.process_receipt(receipt)
        return success_response(data=result, message="Receipt processed successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
