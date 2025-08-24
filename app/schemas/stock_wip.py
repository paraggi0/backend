from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class StockWipSchema(BaseModel):
    part_number: str
    description: str
    quantity: Decimal
    current_station: Optional[str] = None
    last_updated: datetime
    class Config: from_attributes = True
