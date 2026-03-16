from fastapi import APIRouter, Depends, HTTPException , Header
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
from dotenv import load_dotenv



load_dotenv()

from app.database import SessionLocal
from app.models.users import User
from app.helpers.auth_dependencies import get_db, require_admin
from app.models.warden_details import Warden
from app.models.staff import Staff
from app.helpers.validation_schemas import WardenCreate,StaffCreate
from datetime import date

ADMIN_CREATE_SECRET = os.getenv("ADMIN_CREATE_SECRET")

router = APIRouter(prefix="/user-management", tags=["User Management"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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

@router.post("/create-warden")
def create_warden(
    warden_data : WardenCreate,
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):  

    # 🔍 Check if email already exists in users table
    existing_user = db.query(User).filter(User.username == warden_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # 🔐 Create user entry (for login)
    hashed_password = pwd_context.hash(warden_data.password)
    
    new_warden = Warden(
        name=warden_data.name,
        email=warden_data.email,
        phone=warden_data.phone,
        date_of_joining=date.today(),
        gender=warden_data.gender,
        status="Active"
    )

    db.add(new_warden)
    db.commit()
    db.refresh(new_warden)

    warden_user = User(
        username= warden_data.username,
        password=hashed_password,
        role="Warden",
        linked_id=new_warden.warden_id,
        account_status="Active"
    )

    db.add(warden_user)
    db.commit()
    db.refresh(warden_user)


    return {
            "message": "Warden account created successfully",
            "warden_user_id": warden_user.user_id
            }
    
@router.post("/add-staff")
def add_new_staff(
    staff_data: StaffCreate, 
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    
    # 2. Check if staff with the same phone number exists (Optional safety)
    existing_staff = db.query(User).filter(User.username==staff_data.username).first()
    if existing_staff:
        raise HTTPException(status_code=400, detail="User Already Exists")
    
    hashed_password=pwd_context.hash(staff_data.password)

    # 3. Create the Staff record
    new_staff = Staff(
        name=staff_data.name,
        category=staff_data.category,
        phone=staff_data.phone,
        email=staff_data.email,
        status="Active" # Default status
    )

    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    
    staff_user= User(
        username=staff_data.username,
        password=hashed_password,
        role="Maintenance Staff",
        linked_id=new_staff.staff_id,
        account_status="Active"
    )
    
    db.add(staff_user)
    db.commit()
    db.refresh(staff_user)
    
    return {"message": "Staff member added successfully", "staff_id": new_staff.staff_id}
