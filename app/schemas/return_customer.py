from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class ReturnCustomerSchema(BaseModel):
    id: int
    return_number: str
    customer: str
    part_number: str
    quantity: int
    reason: Optional[str] = None
    status: Optional[str] = None
    created_at: datetime
    class Config: from_attributes = True
