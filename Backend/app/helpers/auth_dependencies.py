from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.database import SessionLocal
from app.models.users import User
from app.helpers.authentication import SECRET_KEY, ALGORITHM

security = HTTPBearer()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


'''def get_current_user(
    user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")

    if user.account_status != "Active":
        raise HTTPException(status_code=403, detail="Account not active")

    return user'''
    
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id: int = int(payload.get("sub"))

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can perform this action"
        )
    return current_user

def require_warden(current_user: User = Depends(get_current_user)):
    if current_user.role != "Warden":
        raise HTTPException(status_code=403, detail="Only warden allowed")
    return current_user


    
    
