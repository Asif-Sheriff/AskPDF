from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from ...database.crud.project import create_project
from ..dependencies.session import get_database_session
from src.security.jwt import get_current_user
from typing import Annotated
from src.database.schemas import ProjectCreate  # Import your schema

router = APIRouter()

@router.post("/createProject", status_code=status.HTTP_201_CREATED)
async def create_project_endpoint(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    pdf_file: Annotated[UploadFile, File()],
    current_user: dict = Depends(get_current_user),  # Changed from owner_id to current_user
    db: AsyncSession = Depends(get_database_session)
):
    # Validate file type
    if not pdf_file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    # Read file content
    pdf_content = await pdf_file.read()
    
    # Validate file size (e.g., 10MB max)
    if len(pdf_content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large (max 10MB)"
        )

    await pdf_file.seek(0)
    # Create project data structure
    project_data = ProjectCreate(
        title=title,
        description=description
    )

    return await create_project(
        db=db,
        owner_id=current_user["user_id"],  # Extract user_id from decoded token
        project_data=project_data,  # Use proper schema
        pdf_file=pdf_file,
        filename=pdf_file.filename
    )