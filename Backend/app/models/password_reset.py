# models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timedelta
import uuid
from app.database import Base

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True, index=True)
    #email = Column(String(255), index=True)
    linked_id = Column(Integer)
    token = Column(String(255), unique=True)
    expires_at = Column(DateTime)