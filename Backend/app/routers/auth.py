from fastapi import APIRouter, Depends, HTTPException , Header
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

from app.database import SessionLocal
from app.models.users import User

from app.helpers.validation_schemas import Login

ADMIN_CREATE_SECRET = os.getenv("ADMIN_CREATE_SECRET")

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-admin")
def create_admin(
    username: str,
    password: str,
    secret_key: str = Header(...),
    db: Session = Depends(get_db)
):
    if not ADMIN_CREATE_SECRET:
        raise HTTPException(
        status_code=500,
        detail="Admin secret not configured on server"
    )

    # 1. Validate secret key
    if secret_key.strip() != ADMIN_CREATE_SECRET.strip():
        raise HTTPException(
            status_code=403,
            detail="Unauthorized to create admin"
        )

    # 2. Check if username already exists
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )
        
    #if len(password) < 8 or len(password) > 64:
    #    raise HTTPException(
    #    status_code=400,
    #    detail="Password must be between 8 and 64 characters"
    #    )
    if len(password) < 8 or len(password.encode("utf-8")) > 72:
            raise HTTPException(
            status_code=400,
            detail="Invalid password length"
        )
            
    print("Password value:", repr(password))
    print("Password byte length:", len(password.encode("utf-8")))


    # 3. Hash password
    hashed_password = pwd_context.hash(password)

    # 4. Create admin user
    admin_user = User(
        username=username,
        password=hashed_password,
        role="Admin",
        linked_id=None,
        account_status="Active"
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    return {
        "message": "Admin account created successfully",
        "admin_user_id": admin_user.user_id
    }
    



@router.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.account_status == "Active":
        raise HTTPException(status_code=403, detail="Account not approved by admin")

    return {
        "message": "Login successful",
        "role": user.role,
        "user_id": user.user_id
    }

