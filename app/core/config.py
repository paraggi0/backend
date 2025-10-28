from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database - Using SQLite for testing, replace with MySQL in production
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-replace-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Manufacturing Query API"
    
    class Config:
        env_file = ".env"

settings = Settings()