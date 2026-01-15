from sqlalchemy import Column, Integer, String,  Enum , TIMESTAMP,text

from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255),nullable=False)
    role = Column(Enum("Student", "Warden", "Admin","Maintenance Staff",name="user_roles"), nullable=False)
    linked_id = Column(Integer, nullable=True)
    account_status = Column(Enum("Active", "Disabled",name="account_status"), default="Disabled", nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))