from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from ...database.crud.project import create_project, get_user_projects, delete_project
from ...database.crud.chats import create_system_chat 
from ..dependencies.session import get_database_session
from src.security.jwt import get_current_user
from ..dependencies.verify_owner import verify_project_owner
from typing import Annotated
from src.database.schemas import ProjectCreate  # Import your schema
from src.services.pdf_parser import PDFParser
from src.services.text_chunker import TextChunker
from src.services.vector_store import VectorStore
from src.services.llm import LLMSummarizer
import logging



router = APIRouter()

@router.get("/projects", status_code=status.HTTP_200_OK)
async def fetch_user_projects(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_database_session)
):
    """
    Fetch all projects belonging to the current authenticated user.
    Returns a list of projects with basic information.
    """
    try:

        projects = await get_user_projects(db, current_user["user_id"])
        
        if not projects:
            return []
        
        return [
            {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "pdf_url": project.pdf_url,
                "created_at": project.created_at.isoformat() if project.created_at else None,
                "updated_at": project.updated_at.isoformat() if project.updated_at else None
            }
            for project in projects
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching projects: {str(e)}"
        )


@router.post("/createProject", status_code=status.HTTP_201_CREATED)
async def create_project_endpoint(
    title: Annotated[str, Form()],
    description: Annotated[str, Form()],
    pdf_file: Annotated[UploadFile, File()],
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_database_session)
):
    try:
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
        vector_store = VectorStore(project.id)
        summarizer = LLMSummarizer()

        await pdf_file.close()
        # Process the text
        summary = None
        try:
            # Generate summary
            summary = await summarizer.summarize(pdf_text)
            
            if summary:
                await create_system_chat(
                    db=db,
                    project_id=project.id,
                    message=f"{summary}"
                )
            
            # Chunk text and store in vector DB
            chunks = text_chunker.chunk_text(pdf_text)
            await vector_store.add_texts(
                texts=chunks,
                metadatas=[{"project_id": str(project.id)} for _ in chunks]
            )
        except Exception as e:
            logging.error(f"Text processing error: {str(e)}")
            # Consider whether to raise here if processing is critical

        return {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "created_at": project.created_at.isoformat(),  # Consistent format
            "owner_id": project.user_id,
            "pdf_url": project.pdf_url,
            "summary": summary
        }
    except Exception as e:
        logging.error(f"Project creation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create project"
        )

@router.delete("/project/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project_endpoint(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    user: dict = Depends(verify_project_owner),
    db: AsyncSession = Depends(get_database_session),
):
    try:
        # Delete vector store first
        vector_store = VectorStore(project_id)
        vector_store.delete_project_collection()
        
        # Then delete from database
        await delete_project(db, project_id, current_user["user_id"])
        
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Failed to delete project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete project"
        )
