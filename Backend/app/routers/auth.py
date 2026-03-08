from fastapi import APIRouter, Depends, HTTPException , Header
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import secrets
from app.helpers.authentication import create_access_token

load_dotenv()

from app.database import SessionLocal
from app.models.users import User
from app.models.student_details import Student
from app.helpers.auth_dependencies import get_db
from app.helpers.validation_schemas import Login
from app.models.password_reset import PasswordResetToken



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


'''@router.post("/forgot-password")
async def forgot_password(email_data: dict, db: Session = Depends(get_db)):
    email = email_data.get("email")
    # 1. Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # For security, don't reveal if email exists or not
        return {"message": "If the email exists, a reset link has been sent."}

    # 2. Generate unique token
    token = secrets.token_urlsafe(32)
    expires = datetime.now() + timedelta(hours=1)

    # 3. Save to DB
    new_token = PasswordResetToken(email=email, token=token, expires_at=expires)
    db.add(new_token)
    db.commit()

    # 4. Send Email (Simplified logic)
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    print(f"Send this to {email}: {reset_link}") # In production, use fastapi-mail
    
    return {"message": "Reset link sent successfully"}'''
    
@router.post("/forgot-password")
async def forgot_password(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")

    # 1. Find the student by email to get their user_id
    student = db.query(Student).filter(Student.email == email).first()
    
    if not student:
        # Security tip: still return success so hackers don't know which emails exist
        return {"message": "If the email is registered, a link has been sent."}

    # 2. Generate token and 1-hour expiry
    token = secrets.token_urlsafe(32)
    expires = datetime.now() + timedelta(hours=1)

    # 3. Save token linked to student's user_id
    new_token = PasswordResetToken(linked_id=student.student_id, token=token, expires_at=expires)
    db.add(new_token)
    db.commit()

    # 4. Print link to console (for testing)
    print(f"RESET LINK: http://localhost:5173/reset-password?token={token}")
    
    return {"message": "Reset link sent"}

'''@router.post("/reset-password")
async def reset_password(data: dict, db: Session = Depends(get_db)):
    token = data.get("token")
    new_password = data.get("password")

    # 1. Verify token
    record = db.query(PasswordResetToken).filter(PasswordResetToken.token == token).first()
    if not record or record.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # 2. Update User Password
    user = db.query(User).filter(User.email == record.email).first()
    user.password = pwd_context.hash(new_password) 
    
    # 3. Delete used token
    db.delete(record)
    db.commit()

    return {"message": "Password updated successfully"}'''
    
@router.post("/reset-password")
async def reset_password(data: dict, db: Session = Depends(get_db)):
    token = data.get("token")
    new_password = data.get("password")

    # 1. Verify token exists and is not expired
    record = db.query(PasswordResetToken).filter(PasswordResetToken.token == token).first()
    if not record or record.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="Invalid or expired link")

    # 2. Update the User table using the user_id from our token record
    user = db.query(User).filter(User.linked_id == record.linked_id).first()
    if user:
        user.password = pwd_context.hash(new_password) # Use your hashing utility
        
        # 3. Clean up: Delete the used token
        db.delete(record)
        db.commit()

    return {"message": "Password updated successfully!"}