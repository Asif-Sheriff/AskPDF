from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ...database.schemas import UserCreate, UserResponse  
from ...database.crud.user import create_user, get_user_by_username  
from src.api.dependencies.session import get_database_session  

router = APIRouter(prefix="/signup", tags=["authentication"])


#the response model here is for the openapi spec, to generate docs automatically
@router.post(
    path="",
    response_model=UserResponse,  # Response model
    status_code=status.HTTP_201_CREATED
)
async def signup(
    user_data: UserCreate, 
    db: AsyncSession = Depends(get_database_session)  # Using get_db directly
):
    # Check if user exists
    existing_user = await get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,  # More appropriate code
            detail="Username already exists"
        )
    
    try:
        # Create new user
        new_user = await create_user(db, user_data)
        await db.commit()  # Explicit commit
        return new_user
    except Exception as e:
        await db.rollback()  # Important for error cases
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )