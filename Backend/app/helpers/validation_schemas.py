from pydantic import BaseModel , EmailStr
from datetime import date
from typing import Optional
from decimal import Decimal

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
    
    preferred_room_type: str
    
    date_of_joining: Optional[date] = None
    username: str
    password: str    
    
    
class AddressResponse(BaseModel):
    address: str
    city: str
    state: str    
    pincode: int
    
    class Config:
        from_attributes = True

class StudentProfileResponse(BaseModel):
    student_id: int
    name: str
    admission_number : str
    email: EmailStr
    phone: str
    gender : str
    department: str
    course:str
    semester: int
    status: str
    date_of_joining: Optional[date]
    guardian_name : str
    guardian_phone : str
    guardian_relation : str
    preferred_room_type: str
    
    class Config:
        from_attributes = True
        
class StudentUpdate(BaseModel):
    phone: str
    email: EmailStr
    guardian_phone: str
    '''address: str
    city: str
    state: str    
    pincode: int'''
    
class WardenCreate(BaseModel):
    name: str
    username: str
    password: str
    email: EmailStr
    phone: str
    date_of_joining: date
    status: str
    gender: str
    
class RoomCreate(BaseModel):
    room_number: int
    floor: int
    capacity: int
    room_type: str
    rent: Decimal
    
class AllocateRoom(BaseModel):
    student_id: int
    room_number: int

class RoomChangeRequestCreate(BaseModel):
    requested_room_type: Optional[str]
    requested_room_number: Optional[str]
    reason: Optional[str]


class RoomChangeRequestResponse(BaseModel):
    request_id: int
    student_id: int
    current_room_number: int
    requested_room_type: Optional[str]
    status: str
    request_date: date

    class Config:
        from_attributes = True

class VacateRequestCreate(BaseModel):
    student_id: int
    reason: Optional[str]
    
class WeeklyMealPlanCreate(BaseModel):
    day_of_the_week: str
    breakfast: str
    lunch: str
    dinner: str
    
class MealPreferenceCreate(BaseModel):
    date: date
    breakfast: bool
    lunch: bool
    dinner: bool
    

