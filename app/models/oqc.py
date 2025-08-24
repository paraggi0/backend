from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class OQC(Base):
    __tablename__ = "oqc"
    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(String(100), ForeignKey("master_prod.part_number"))
    quantity_passed = Column(DECIMAL(10, 2), nullable=False)
    inspection_date = Column(TIMESTAMP)
    inspector_id = Column(Integer, ForeignKey("users.id"))
    notes = Column(Text)

    inspector = relationship("User")
    product = relationship("MasterProd")
