# database/crud/chat.py
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.chat import Chat
from ..schemas import ChatCreate
import boto3
from botocore.exceptions import ClientError
import os
from datetime import datetime

async def create_chat_with_pdf(
    db: AsyncSession,
    owner_id: int,
    chat_data: ChatCreate,
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

        # Generate unique S3 key (e.g., "user123/chat-abc123.pdf")
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        s3_key = f"user_{owner_id}/chat_{timestamp}_{filename}"

        s3.upload_fileobj(
            pdf_file,  # File-like object (use `pdf_file.file` if FastAPI UploadFile)
            os.getenv("AWS_S3_BUCKET"),
            s3_key
        )
        s3_url = f"https://{os.getenv('AWS_S3_BUCKET')}.s3.amazonaws.com/{s3_key}"

        # --- Store Chat Metadata in DB ---
        async with db.begin():
            chat = Chat(
                title=chat_data.title,
                description=chat_data.description,
                owner_id=owner_id,
                pdf_s3_key=s3_key,       # Store S3 reference
                pdf_original_name=filename
            )
            db.add(chat)
            await db.commit()
            await db.refresh(chat)
        
        return chat

    except ClientError as e:
        # S3 upload failed
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