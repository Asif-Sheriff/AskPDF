from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from ..base import Base  # Assuming you have a Base class similar to your Project model

class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)  # Links to the project this chat belongs to
    sender_type = Column(Enum('USER', 'SYSTEM', name='sender_types'), nullable=False)  # Whether the message is from USER or SYSTEM
    message = Column(Text)  # The actual chat message content
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Auto-set on creation

    # Optional: Add __repr__ for better debugging
    def __repr__(self):
        return f"<Chat(chat_id={self.chat_id}, project_id={self.project_id}, sender_type='{self.sender_type}')>"