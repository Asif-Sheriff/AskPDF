from fastapi import APIRouter,status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..dependencies.session import get_database_session
from ..dependencies.verify_owner import verify_project_owner
from src.security.jwt import get_current_user
from src.database.crud.chats import get_project_chats
from src.database.schemas import ChatResponse

router = APIRouter()

@router.get("/chats/{project_id}", status_code=status.HTTP_200_OK, response_model=list[ChatResponse])
async def fetch_user_chats(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    user: dict = Depends(verify_project_owner),
    db: AsyncSession = Depends(get_database_session),
) -> list[ChatResponse]:
    """
    Fetch all chat messages for a specific project.
    """
    chats = await get_project_chats(db, project_id)
    return [ChatResponse.model_validate(chat) for chat in chats]  # Replaces from_orm()
