from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.users import User


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")

    if user.account_status != "Active":
        raise HTTPException(status_code=403, detail="Account not active")

    return user
