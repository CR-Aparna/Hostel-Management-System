from pydantic import BaseModel , EmailStr
from datetime import date
from typing import Optional,Literal,List
from decimal import Decimal

class Login(BaseModel):
    username: str
    password: str
    
class GuardianBase(BaseModel):
    name: str
    phone: str
    relation: str
    type: str   # "Primary" or "Local"
    address: Optional[str] = None
    

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
    # guardian_name : str
    # guardian_phone : str
    # guardian_relation : str
    guardians:List[GuardianBase]
    
    preferred_room_type: str
    preferred_food_type: str
    
    caution_deposit:str
    
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
    # guardian_name : str
    # guardian_phone : str
    # guardian_relation : str
    guardians:List[GuardianBase]
    preferred_room_type: str
    preferred_food_type: str
    caution_deposit:str
    addresses:Optional[AddressResponse]
    
    class Config:
        from_attributes = True
        
class StudentUpdate(BaseModel):
    phone: str
    email: EmailStr
    primary_guardian_phone: str
    local_guardian_phone: str
    address: str
    city: str
    state: str    
    pincode: int
    
    class Config:
        from_attributes = True
    
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
    
class RoomResponse(BaseModel):
    room_number: int
    floor: int
    capacity: int
    room_type: str
    status: str
    rent: Decimal
    
    class Config:
        from_attributes = True
    
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
    reason: Optional[str]
    
class WeeklyMealPlanCreate(BaseModel):
    day_of_the_week: str
    breakfast: str
    lunch: str
    dinner: str
    meal_type: str
    
class MealPreferenceCreate(BaseModel):
    breakfast: bool
    lunch: bool
    dinner: bool
    
class MessCutRequestCreate(BaseModel):
    from_date: date
    to_date: date
    reason: str

class PaymentVerifyRequest(BaseModel):
    status: Literal["success", "failure"]
    method: str
    

class MaintenanceCreate(BaseModel):
    description: str
    category: str
    room_number: str
    is_emergency: bool = False
    assigned_staff: Optional[int] = None

class MaintenanceUpdate(BaseModel):
    #is_minor_or_emergency: bool = False
    assigned_staff: Optional[int] = None
    remarks: Optional[str] = None
    decision: Optional[str] = None # Approve, Reject
    

# --- Complaint Schemas ---
class ComplaintCreate(BaseModel):
    subject: str
    description: str
    issue_type: str # Mess, Security, Discipline

class ComplaintResolve(BaseModel):
    status: str
    action_taken:Optional[str]=None   
    
class StaffCreate(BaseModel):
    name: str
    category: str  # e.g., "Plumber", "Electrician", "Cleaner"
    phone: str
    email: EmailStr
    username : str
    password : str
