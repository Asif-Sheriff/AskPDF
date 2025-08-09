from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints import router as api_endpoint_router

def initialize_backend_application() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins='*',
        # allow_credentials=settings.IS_ALLOWED_CREDENTIALS,
        # allow_methods=settings.ALLOWED_METHODS,
        # allow_headers=settings.ALLOWED_HEADERS,
    )

    app.include_router(router=api_endpoint_router)

    return app

backend_app: FastAPI = initialize_backend_application()
