from pydantic import BaseModel , EmailStr
from datetime import date
from typing import Optional


class Login(BaseModel):
    username: str
    password: str
    

class StudentRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    department: str
    year: int
    date_of_joining: Optional[date] = None
    username: str
    password: str

class StudentProfileResponse(BaseModel):
    student_id: int
    name: str
    email: EmailStr
    phone: str
    department: str
    year: int
    status: str
    date_of_joining: Optional[date]

    class Config:
        from_attributes = True
        
class StudentUpdate(BaseModel):
    phone: str
    department: str
    year: int
