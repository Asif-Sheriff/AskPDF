from sqlalchemy.future import select
from src.database.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_user_by_username(db, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalars().first()

async def create_user(db, user_data):
    hashed_password = pwd_context.hash(user_data.password)
    db_user = User(username=user_data.username, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def authenticate_user(db, username: str, password: str):
    user = await get_user_by_username(db, username)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user