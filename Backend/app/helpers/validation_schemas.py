from pydantic import BaseModel , EmailStr
from datetime import date
from typing import Optional


class Login(BaseModel):
    username: str
    password: str
    

class StudentRegister(BaseModel):
    #Basic information
    name: str
    admission_number : str
    email: EmailStr
    phone: str
    gender : str
    department: str
    course: str
    semester: int
    
    #Address details
    address : str
    city : str
    state : str
    pincode : int
    
    #Parent/Guardian details
    guardian_name : str
    guardian_phone : str
    guardian_relation : str
    
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
