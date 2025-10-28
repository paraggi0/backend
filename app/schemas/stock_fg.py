from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class StockFgSchema(BaseModel):
    part_number: str
    quantity: Decimal
    location: Optional[str] = None
    last_updated: datetime
    class Config: from_attributes = True
