from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.security.jwt  import jwt_generator
from src.database.crud.project import get_project
from fastapi.security import OAuth2PasswordBearer
from .session import get_database_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def verify_project_owner(
    project_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_database_session)  # Assuming you have a get_db dependency
) -> dict:
    """
    Dependency to verify that the current user is the owner of the specified project.
    
    Args:
        project_id: ID of the project to check
        token: JWT token for authentication
        db: Database session
    
    Returns:
        The user data if verification succeeds
    
    Raises:
        HTTPException(401) if token is invalid or user doesn't own the project
        HTTPException(404) if project doesn't exist
    """
    try:
        # Get current user from token
        user_data = jwt_generator.retrieve_details_from_token(token)
        user_id = user_data.get("user_id")  # Assuming your token has an "id" field
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Get project from database
        project = await get_project(db=db, project_id=project_id)
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Check if user is the owner
        if project.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="You don't have permission to access this project",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return user_data
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )