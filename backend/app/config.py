import logging
import os
import secrets

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_ignore_empty=True
    )

    allowed_origins: str = "http://localhost:3000"

    secret_key: str = Field(default_factory=lambda: secrets.token_hex(32), min_length=16)

    max_message_length: int = 2000

    gemini_api_key: str | None = None

    qdrant_url: str | None = None
    qdrant_api_key: str | None = None

    supabase_url: str | None = None
    supabase_key: str | None = None

    github_token: str | None = None
    github_username: str | None = None

    github_allowed_repos: str = ""

    resend_api_key: str | None = None
    resend_from_email: str | None = None                                          
    contact_email_to: str | None = None                               

    admin_username: str | None = None
    admin_password: str | None = None

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def github_allowed_repos_list(self) -> list[str]:
        return [repo.strip() for repo in self.github_allowed_repos.split(",") if repo.strip()]

settings = Settings()

if "SECRET_KEY" not in os.environ or not os.environ["SECRET_KEY"].strip():
    logger.warning(
        "SECRET_KEY is not set — using a random key generated at startup. "
        "Set it explicitly in production."
    )
