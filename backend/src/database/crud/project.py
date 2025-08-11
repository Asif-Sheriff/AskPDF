from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.projects import Project
from ..schemas import ProjectCreate  # Make sure this schema matches what you need
import boto3
from botocore.exceptions import ClientError
import os
from datetime import datetime
from sqlalchemy import select
from sqlalchemy import delete
from src.database.models.chats import Chat  # Import your Chat model
from src.services.vector_store import VectorStore



async def get_user_projects(db: AsyncSession, user_id: int):
    """Get all projects for a specific user"""
    result = await db.execute(
        select(Project)
        .where(Project.user_id == user_id)
        .order_by(Project.created_at.desc())
    )
    return result.scalars().all()

async def get_project(db: AsyncSession, project_id: int):
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id)
    )

    return result.scalars().first()

async def create_project(
    db: AsyncSession,
    owner_id: int,
    project_data: ProjectCreate,
    pdf_file: UploadFile,  # Raw PDF bytes (from FastAPI's UploadFile)
    filename: str     # Original filename
):
    try:
        # --- Upload PDF to S3 ---
        s3 = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION")
        )

        # Generate unique S3 key
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        s3_key = f"user_{owner_id}/project_{timestamp}_{filename}"

        s3.upload_fileobj(
            pdf_file.file,
            os.getenv("AWS_S3_BUCKET"),
            s3_key
        )
        s3_url = f"https://{os.getenv('AWS_S3_BUCKET')}.s3.amazonaws.com/{s3_key}"

        # --- Store Project Metadata in DB ---
        async with db.begin():
            project = Project(
                user_id=owner_id,  # Changed from owner_id to user_id to match model
                title=project_data.title,
                description=project_data.description,  # Make sure ProjectCreate has this field
                pdf_url=s3_url,  # Store the public URL
                pdf_s3_key=s3_key,
                pdf_original_name=filename
            )
            db.add(project)
            await db.flush()
            await db.refresh(project)
        
        return project

    except ClientError as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"S3 upload failed: {str(e)}"
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    
async def delete_file(s3_key: str):
    """Delete a file from S3"""
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION")
        )
        
        s3.delete_object(
            Bucket=os.getenv("AWS_S3_BUCKET"),
            Key=s3_key
        )
        return True
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        if error_code == 'NoSuchKey':
            # File doesn't exist, which we can consider as successfully deleted
            return True
        raise HTTPException(
            status_code=500,
            detail=f"S3 deletion failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"S3 operation failed: {str(e)}"
        )

async def delete_project(
    db: AsyncSession,
    project_id: int,
    user_id: int
):
    """Delete a project including its S3 file, chats, and database record"""
    try:
        # Get the project
        project = await get_project(db, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        # Delete from S3 if it exists
        if project.pdf_s3_key:
            try:
                await delete_file(project.pdf_s3_key)
            except Exception as s3_error:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to delete S3 file: {str(s3_error)}"
                )

        # First delete all chats associated with the project
        await db.execute(
            delete(Chat)
            .where(Chat.project_id == project_id)
        )
        
        # Then delete the project
        await db.execute(
            delete(Project)
            .where(Project.id == project_id)
        )
        await db.commit()
        
        return True

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Project deletion failed: {str(e)}"
        )