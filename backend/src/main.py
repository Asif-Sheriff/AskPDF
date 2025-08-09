from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints import router as api_endpoint_router

def initialize_backend_application() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://127.0.0.1:5500",  # Add your frontend origin
            "http://localhost:5500",   # Common alternative
            "http://localhost:8000",  # If you access backend directly
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router=api_endpoint_router)

    return app

backend_app: FastAPI = initialize_backend_application()
