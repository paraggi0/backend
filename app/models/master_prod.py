from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from app.database.base import Base

class MasterProd(Base):
    __tablename__ = "master_prod"
    id = Column(Integer, primary_key=True, index=True)
    customer = Column(String(255), index=True)
    part_number = Column(String(100), unique=True, index=True, nullable=False)
    model = Column(String(100))
    description = Column(Text)
    timestamp = Column(TIMESTAMP)
