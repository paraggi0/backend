from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from app.database.base import Base

class ReturnCustomer(Base):
    __tablename__ = "returns"
    id = Column(Integer, primary_key=True, index=True)
    return_number = Column(String(255), unique=True, nullable=False)
    customer = Column(String(255), nullable=False)
    part_number = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    reason = Column(Text)
    status = Column(String(50), default='PENDING')
    created_at = Column(TIMESTAMP)
