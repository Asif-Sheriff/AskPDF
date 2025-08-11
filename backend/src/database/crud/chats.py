from sqlalchemy.ext.asyncio import AsyncSession
from ..models.chats import Chat
from sqlalchemy import select

async def create_system_chat(
    db: AsyncSession,
    project_id: int,
    message: str
) -> Chat:
    """
    Create a system chat message in the database.
    """
    system_chat = Chat(
        project_id=project_id,
        sender_type="SYSTEM",
        message=message
    )
    db.add(system_chat)
    await db.commit()
    await db.refresh(system_chat)
    return system_chat


async def get_project_chats(
    db: AsyncSession,
    project_id: int
) -> list[Chat]:
    """
    Retrieve all chat messages for a specific project from the database.
    
    Args:
        db: Async database session
        project_id: ID of the project to get chats for
    
    Returns:
        List of Chat objects ordered by creation time (oldest first)
    
    Raises:
        No exceptions are raised if no chats are found (returns empty list)
    """
    result = await db.execute(
        select(Chat)
        .where(Chat.project_id == project_id)
        .order_by(Chat.created_at.asc())  # Oldest messages first
    )
    chats = result.scalars().all()
    return chats