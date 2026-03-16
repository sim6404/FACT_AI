from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "F.A.C.T API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8h
    ALGORITHM: str = "HS256"

    # SSO / OIDC
    OIDC_ISSUER: str = ""
    OIDC_CLIENT_ID: str = ""
    OIDC_CLIENT_SECRET: str = ""

    # PostgreSQL
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "fact_app"
    POSTGRES_USER: str = "fact"
    POSTGRES_PASSWORD: str = Field(..., env="POSTGRES_PASSWORD")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def sync_database_url(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # Snowflake
    SNOWFLAKE_ACCOUNT: str = Field(..., env="SNOWFLAKE_ACCOUNT")
    SNOWFLAKE_USER: str = Field(..., env="SNOWFLAKE_USER")
    SNOWFLAKE_PASSWORD: str = Field(default="", env="SNOWFLAKE_PASSWORD")
    SNOWFLAKE_PRIVATE_KEY_PATH: str = ""
    SNOWFLAKE_WAREHOUSE: str = "FACT_WH_S"
    SNOWFLAKE_DATABASE: str = "FACT_DB"
    SNOWFLAKE_SCHEMA: str = "PUBLIC"
    SNOWFLAKE_ROLE: str = "FACT_APP_ROLE"

    # Cortex
    CORTEX_ANALYST_SEMANTIC_FILE: str = "@FACT_DB.PUBLIC.SEMANTIC_MODELS/fact_semantic.yaml"
    CORTEX_SEARCH_SERVICE: str = "FACT_DOC_SEARCH"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 300  # 5min default

    # Object Storage (S3 / Azure Blob / GCS)
    STORAGE_PROVIDER: str = "s3"           # s3 | azure | gcs
    STORAGE_BUCKET: str = "fact-reports"
    AWS_REGION: str = "ap-northeast-2"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""

    # Notifications
    SLACK_WEBHOOK_URL: str = ""
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
