import pydantic
from datetime import datetime
from typing import Optional


from datetime import datetime
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str  # Only for input during creation

class UserInDB(BaseModel):
    id: int
    username: str
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
        # Explicitly exclude sensitive fields
        exclude = {'hashed_password', 'hash_salt'}

class UserResponse(UserInDB):
    # Inherits all fields from UserInDB
    pass

class JWToken(pydantic.BaseModel):
    access_token: str
    token_type: str = "bearer"


class JWTAccount(pydantic.BaseModel):
    username: str
    user_id: str
    exp: int  # expiration timestamp
    sub: str  # subject


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectResponse(ProjectCreate):
    id: int
    owner_id: int
    created_at: datetime