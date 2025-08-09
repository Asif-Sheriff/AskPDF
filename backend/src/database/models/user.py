from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)  # Added length limit
    hashed_password = Column(String(255))  # Enough length for modern hashes
    hash_salt = Column(String(255))  # For storing the salt used in password hashing
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Auto-set on creation
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # Auto-updates on change

    # Optional: Add __repr__ for better debugging
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"