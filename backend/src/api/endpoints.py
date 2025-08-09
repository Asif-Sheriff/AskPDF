import fastapi

from src.api.routes.login import router as login_router
from src.api.routes.signup import router as signup_router
from src.api.routes.chats import router as project_router

router = fastapi.APIRouter()

router.include_router(router=login_router)
router.include_router(router=signup_router)
router.include_router(router=project_router)