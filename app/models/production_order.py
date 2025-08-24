from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum as SQLAlchemyEnum, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class ProductionOrder(Base):
    __tablename__ = "production_orders"
    id = Column(Integer, primary_key=True, index=True)
    lot_number = Column(String(100), unique=True, nullable=False)
    part_number = Column(String(100), ForeignKey("master_prod.part_number"))
    quantity_to_produce = Column(DECIMAL(10, 2), nullable=False)
    initial_wip_stock = Column(DECIMAL(10, 2), nullable=False)
    status = Column(SQLAlchemyEnum('running', 'rework', 'pending', 'cancelled', name='po_status_enum'), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(TIMESTAMP)
    completion_date = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP)
    
    creator = relationship("User")
    product = relationship("MasterProd")
