from fastapi import APIRouter, HTTPException, status
from typing import List
from schemas.product_schema import ProductCreate, ProductResponse
from utils.response import success_response, error_response
from services import inventory_service

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate):
    try:
        new_product = inventory_service.create_product(product)
        return success_response(data=new_product, message="Product created successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("", response_model=dict)
def get_products():
    try:
        products = inventory_service.get_products()
        return success_response(data=products, message="Products retrieved successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
