import fastapi

from src.api.routes.login import router as login_router
from src.api.routes.signup import router as signup_router
from src.api.routes.project import router as project_router
from src.api.routes.query import router as query_router
from src.api.routes.chat import router as chat_router

router = fastapi.APIRouter()

router.include_router(router=query_router)
router.include_router(router=login_router)
router.include_router(router=signup_router)
router.include_router(router=project_router)
router.include_router(router=chat_router)