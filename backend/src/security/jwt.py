from datetime import datetime, timezone, timedelta  # Note: timedelta directly imported
import os
from jose import jwt as jose_jwt, JWTError
from pydantic import ValidationError
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Load environment variables
load_dotenv()

class JWTGenerator:
    def __init__(self):
        # Validate critical env vars on initialization
        if not os.getenv("JWT_SECRET_KEY"):
            raise ValueError("JWT_SECRET_KEY must be set in environment variables")

    def _generate_jwt_token(
        self,
        *,
        jwt_data: dict[str, str],
        expires_delta: timedelta | None = None,
    ) -> str:
        to_encode = jwt_data.copy()

        # Fixed timedelta usage and added default expiration
        expire = datetime.now(timezone.utc) + (
            expires_delta 
            or timedelta(minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRATION_TIME", 30)))
        )
        to_encode.update({
            "exp": expire,
            "sub": os.getenv("JWT_SUBJECT", "access")
        })

        try:
            return jose_jwt.encode(
                to_encode,
                key=os.getenv("JWT_SECRET_KEY"),
                algorithm=os.getenv("JWT_ALGORITHM", "HS256")
            )
        except Exception as e:
            raise ValueError(f"JWT encoding failed: {str(e)}")

    def generate_access_token(self, user) -> str:
        if not user or not hasattr(user, 'username'):
            raise ValueError("Invalid user object for token generation")

        # Create payload with minimal required claims
        jwt_data = {
            "username": user.username,
            # Add user ID if available
            "user_id": str(getattr(user, 'id', ''))
        }

        return self._generate_jwt_token(
            jwt_data=jwt_data,
            expires_delta=timedelta(
                minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRATION_TIME", 30))
        )
        )

    def retrieve_details_from_token(self, token: str) -> dict:
        try:
            payload = jose_jwt.decode(
                token=token,
                key=os.getenv("JWT_SECRET_KEY"),
                algorithms=[os.getenv("JWT_ALGORITHM", "HS256")]
            )
            return {
                "username": payload.get("username"),
                "user_id": payload.get("user_id")
            }
        except JWTError as e:
            raise ValueError("Invalid token") from e
        except Exception as e:
            raise ValueError(f"Token processing failed: {str(e)}") from e

# Singleton instance
jwt_generator = JWTGenerator()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")  # Your login endpoint

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency to validate and get user from JWT token"""
    try:
        return jwt_generator.retrieve_details_from_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )