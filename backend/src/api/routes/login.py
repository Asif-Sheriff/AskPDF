from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from ...database.schemas import JWToken
from ...database.crud.user import authenticate_user
from ..dependencies.session import get_database_session
from src.security.jwt import jwt_generator 
router = APIRouter(
    prefix="/login",
    tags=["authentication"]
)

@router.post("", response_model=JWToken)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_database_session)
):
    # 1. Authenticate user
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 2. Generate token using your JWTGenerator
    try:
        access_token = jwt_generator.generate_access_token(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token generation failed"
        )
    
    # 3. Return standardized token response
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }