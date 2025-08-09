from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ...database.db import get_db  # Your async DB session generator

async def get_database_session(db: AsyncSession = Depends(get_db)):
    """Injects a database session into routes"""
    return db

