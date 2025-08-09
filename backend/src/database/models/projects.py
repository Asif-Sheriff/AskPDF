from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..base import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)  # Links to the user who created the project
    title = Column(String(255))  # Title of the project
    description = Column(Text, nullable=True)  # Added this field
    pdf_url = Column(String(255))  # URL to access the PDF
    pdf_s3_key = Column(String(255))  # S3 storage key
    pdf_original_name = Column(String(255))  # Original filename
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Project(id={self.id}, user_id={self.user_id}, title='{self.title}')>"