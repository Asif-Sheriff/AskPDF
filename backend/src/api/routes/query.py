# routes/query.py
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..dependencies.session import get_database_session
from ..dependencies.verify_owner import verify_project_owner
from src.security.jwt import get_current_user
from src.database.crud.chats import create_system_chat
from src.database.crud.chats import create_user_chat
from src.database.crud.chats import get_project_chats

from src.services.vector_store import VectorStore
from src.services.llm import LLMSummarizer
import logging

router = APIRouter()

# Request body schema
class QueryRequest(BaseModel):
    query: str
    top_k: int = 4


# Initialize services (singleton style)


@router.post("/query/{project_id}", status_code=status.HTTP_201_CREATED)
async def query_endpoint(
    project_id: int,
    payload: QueryRequest,
    current_user: dict = Depends(get_current_user),
    user: dict = Depends(verify_project_owner),  # Added ownership verification
    db: AsyncSession = Depends(get_database_session)
):
    try:
        # Initialize project-specific vector store
        vector_store = VectorStore(project_id) 
        llm = LLMSummarizer()

        # 1. Get chat history
        chat_history = await get_project_chats(db, project_id)
        
        # 2. Store user's query
        await create_user_chat(db, project_id, payload.query)
        
        # 3. Perform similarity search
        similar_docs = vector_store.similarity_search(
            query=payload.query,
            k=payload.top_k or 4  # Default to 4 if not specified
        )

        if not similar_docs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No relevant documents found"
            )

        # 4. Prepare context
        concatenated_text = "\n\n".join(
            [doc["document"] for doc in similar_docs[:5]]  # Limit to top 5 docs
        )

        # 5. Format chat history (last 5 messages)
        formatted_history = "\n".join(
            [f"{'USER' if chat.sender_type else 'SYSTEM'}: {chat.message}" 
             for chat in chat_history[-8:]]  # Last 5 messages
        )
        
        full_context = f"Conversation history:\n{formatted_history}\n\nRelevant documents:\n{concatenated_text}"

        # 6. Get LLM response
        llm_response = await llm.answer_with_context(
            query=payload.query,
            context_docs=full_context
        )

        # 7. Store and return response
        await create_system_chat(db, project_id, llm_response)

        return {
            "query": payload.query,
            "matches": similar_docs,
            "llm_response": llm_response,
            "context_used": {
                "documents": len(similar_docs),
                "history_items": len(chat_history)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Query failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process query"
        )