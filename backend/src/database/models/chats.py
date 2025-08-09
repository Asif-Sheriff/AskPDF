from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..base import Base  # Assuming you have a Base class similar to User model

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)  # Links to the user who created the chat
    pdf_url = Column(String(255))  # URL or path to the stored PDF
    user_message = Column(Text)  # User's initial message/query about the PDF
    system_message = Column(Text)  # System's response to the user
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Auto-set on creation
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # Auto-updates on change

    # Optional: Add __repr__ for better debugging
    def __repr__(self):
        return f"<Chat(id={self.id}, user_id={self.user_id}, pdf_url='{self.pdf_url[:20]}...')>"