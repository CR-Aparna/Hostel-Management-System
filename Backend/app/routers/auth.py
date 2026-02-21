from fastapi import APIRouter, Depends, HTTPException , Header
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from app.helpers.authentication import create_access_token

load_dotenv()

from app.database import SessionLocal
from app.models.users import User
from app.helpers.auth_dependencies import get_db
from app.helpers.validation_schemas import Login


router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.account_status == "Active":
        raise HTTPException(status_code=403, detail="Account not approved by admin")

    token = create_access_token({
        "sub":str(user.user_id),
        "role":user.role
    })
    
    return {
        "message": "Login successful",
        "role": user.role,
        "access_token":token,
        "token_type": "bearer " 
    }

