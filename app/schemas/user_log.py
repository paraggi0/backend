from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class UserLogSchema(BaseModel):
    id_user: int
    email: EmailStr
    created_at: datetime
    logs_status: Optional[str] = None
    class Config: from_attributes = True
