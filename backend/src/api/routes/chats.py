from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from ...database.crud.project import create_project
from ..dependencies.session import get_database_session
from src.security.jwt import get_current_user
from typing import Annotated
from src.database.schemas import ProjectCreate  # Import your schema
from src.services.pdf_parser import PDFParser
from src.services.text_chunker import TextChunker
from src.services.vector_store import VectorStore
from src.services.llm import LLMSummarizer

router = APIRouter()

@router.post("/createProject", status_code=status.HTTP_201_CREATED)
async def create_project_endpoint(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    pdf_file: Annotated[UploadFile, File()],
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_database_session)
):
    # Validate PDF file
    PDFParser.validate_pdf_file(pdf_file)
    
    # Read and validate file size
    pdf_content = await pdf_file.read()
    if len(pdf_content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large (max 10MB)"
        )
    await pdf_file.seek(0)

    # Extract text from PDF
    pdf_text = await PDFParser.extract_text_from_pdf(pdf_file)

    # Create project in database
    project_data = ProjectCreate(title=title, description=description)
    project = await create_project(
        db=db,
        owner_id=current_user["user_id"],
        project_data=project_data,
        pdf_file=pdf_file,
        filename=pdf_file.filename
    )

    # Initialize services
    text_chunker = TextChunker()
    vector_store = VectorStore()
    summarizer = LLMSummarizer()

    # Initialize summary as None
    summary = None
    
    # Process the text
    try:
        # Generate summary
        summary = await summarizer.summarize(pdf_text)
        
        # Chunk text and store in vector DB
        chunks = text_chunker.chunk_text(pdf_text)
        await vector_store.add_texts(
            texts=chunks,
            metadatas=[{"project_id": str(project.id)} for _ in chunks]
        )
    except Exception as e:
        # Log error but don't fail the request
        print(f"Text processing error: {str(e)}")

    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "created_at": project.created_at,
        "owner_id": project.user_id,
        "pdf_url": project.pdf_url,
        "summary": summary  # Now summary is always defined
    }