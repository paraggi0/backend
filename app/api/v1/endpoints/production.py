from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.core.security import get_current_user
from app.models import User, ProductionOrder, OutputMc, StockWip
from app.schemas import ProductionOrderSchema, OutputMcSchema, StockWipSchema

router = APIRouter()

@router.get("/orders", response_model=List[ProductionOrderSchema])
def get_production_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 100):
    return db.query(ProductionOrder).offset(skip).limit(limit).all()

@router.get("/outputs", response_model=List[OutputMcSchema])
def get_machine_outputs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 100):
    return db.query(OutputMc).offset(skip).limit(limit).all()

@router.get("/stock-wip", response_model=List[StockWipSchema])
def get_wip_stock(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(StockWip).all()

