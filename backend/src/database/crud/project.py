from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.projects import Project
from ..schemas import ChatCreate  # Make sure this schema matches what you need
import boto3
from botocore.exceptions import ClientError
import os
from datetime import datetime


async def create_project(
    db: AsyncSession,
    owner_id: int,
    project_data: ChatCreate,
    pdf_file: bytes,  # Raw PDF bytes (from FastAPI's UploadFile)
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
            pdf_file,
            os.getenv("AWS_S3_BUCKET"),
            s3_key
        )
        s3_url = f"https://{os.getenv('AWS_S3_BUCKET')}.s3.amazonaws.com/{s3_key}"

        # --- Store Project Metadata in DB ---
        async with db.begin():
            project = Project(
                user_id=owner_id,  # Changed from owner_id to user_id to match model
                title=project_data.title,
                description=project_data.description,  # Make sure ChatCreate has this field
                pdf_url=s3_url,  # Store the public URL
                pdf_s3_key=s3_key,
                pdf_original_name=filename
            )
            db.add(project)
            await db.commit()
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