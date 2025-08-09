from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...database.crud.project import create_chat_with_pdf
from ..dependencies.session import get_database_session

router = APIRouter()

@router.post("/createchat")
async def create_chat(
    title: str = Form(...),
    description: str = Form(...),
    pdf_file: UploadFile = File(...),
    owner_id: int = Depends(get_current_user),  # Your auth dependency
    db: AsyncSession = Depends(get_database_session)
):
    # Validate file type
    if not pdf_file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are allowed")

    # Read file content (stream to avoid memory issues for large files)
    pdf_content = await pdf_file.read()

    return await create_chat_with_pdf(
        db=db,
        owner_id=owner_id,
        chat_data={"title": title, "description": description},
        pdf_file=pdf_content,
        filename=pdf_file.filename
    )