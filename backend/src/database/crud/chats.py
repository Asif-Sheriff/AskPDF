from sqlalchemy.ext.asyncio import AsyncSession
from ..models.chats import Chat

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