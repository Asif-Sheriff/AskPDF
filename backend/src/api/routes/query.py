# routes/query.py
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..dependencies.session import get_database_session
from src.security.jwt import get_current_user
from src.database.crud.chats import create_system_chat
from src.database.crud.chats import create_user_chat

from src.services.vector_store import VectorStore
from src.services.llm import LLMSummarizer

router = APIRouter()

# Request body schema
class QueryRequest(BaseModel):
    query: str
    top_k: int = 4


# Initialize services (singleton style)
vector_store = VectorStore()
llm = LLMSummarizer()


@router.post("/query/{projectId}", status_code=status.HTTP_201_CREATED)
async def query_endpoint(
    projectId: int,
    payload: QueryRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_database_session)
):
    try:
        # 1. Perform similarity search

        await create_user_chat(db, projectId, payload.query)
        similar_docs = vector_store.similarity_search(payload.query, k=payload.top_k)

        if not similar_docs:
            raise HTTPException(status_code=404, detail="No similar documents found.")

        # 2. Concatenate document texts
        concatenated_text = "\n\n".join([doc["document"] for doc in similar_docs])

        # 3. Send to LLM with original query
        llm_response = await llm.answer_with_context(
            query=payload.query,
            context_docs=concatenated_text
        )

        await create_system_chat(db, projectId, llm_response)

        # 4. Return response
        return {
            "query": payload.query,
            "matches": similar_docs,
            "llm_response": llm_response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))