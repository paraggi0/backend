from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from .user import UserSchema

class OQCSchema(BaseModel):
    id: int
    part_number: str
    quantity_passed: Decimal
    inspection_date: Optional[datetime] = None
    inspector: Optional[UserSchema] = None
    class Config: from_attributes = True
