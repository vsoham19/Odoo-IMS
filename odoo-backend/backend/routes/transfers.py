from fastapi import APIRouter, HTTPException, status
from schemas.inventory_schema import TransferCreate
from utils.response import success_response
from services import inventory_service

router = APIRouter(prefix="/transfers", tags=["Internal Transfers"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def process_transfer(transfer: TransferCreate):
    try:
        result = inventory_service.process_transfer(transfer)
        return success_response(data=result, message="Transfer processed successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
