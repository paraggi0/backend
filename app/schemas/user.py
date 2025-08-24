from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class UserSchema(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    class Config: from_attributes = True
