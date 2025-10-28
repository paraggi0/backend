from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, ForeignKey
from app.database.base import Base

class UserLog(Base):
    __tablename__ = "user_log"
    id_user = Column(Integer, ForeignKey("users.id"), primary_key=True)
    email = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    logs_status = Column(Text)
