"""All settings and secrets for the app, loaded from environment variables.

Nothing secret is ever hardcoded here. Locally the values come from the .env file;
in production (Render) they come from the dashboard's environment variables.
"""

import logging
import os
import secrets

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    # env_ignore_empty is important, not cosmetic. Without it a blank line in
    # .env (like "SECRET_KEY=") counts as the value "", so the default below is
    # skipped and the app runs with an empty signing key — which anyone can
    # reproduce, making signed email drafts forgeable. Blank now means "not set".
    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_ignore_empty=True
    )

    # Which website addresses are allowed to call this API from a browser.
    # Comma-separated, e.g. "http://localhost:3000,https://myportfolio.vercel.app"
    allowed_origins: str = "http://localhost:3000"

    # Used to sign email drafts (see security.py). Left unset, a random one is
    # generated per process — safe, but drafts stop being valid on restart, and
    # with more than one worker each would sign differently. Set it explicitly in
    # production. It must never be empty: an empty key is a key everyone knows.
    secret_key: str = Field(default_factory=lambda: secrets.token_hex(32), min_length=16)

    # Longest visitor message we'll accept. Stops someone pasting a huge wall of
    # text that would cost a lot of tokens to process.
    max_message_length: int = 2000

    # --- The AI brain ---
    gemini_api_key: str | None = None

    # --- Vector database, holds the embedded portfolio content for RAG ---
    qdrant_url: str | None = None
    qdrant_api_key: str | None = None

    # --- Postgres database, stores chat history and contact messages ---
    supabase_url: str | None = None
    supabase_key: str | None = None

    # --- GitHub, for looking up repo details live ---
    github_token: str | None = None
    github_username: str | None = None
    # Only these repos can be looked up. Comma-separated exact names.
    # Blank means nothing is allowed — this is deliberate, so the tool can't be
    # tricked into pulling arbitrary repos off GitHub.
    github_allowed_repos: str = ""

    # --- Email sending ---
    resend_api_key: str | None = None
    resend_from_email: str | None = None  # must be on a domain verified in Resend
    contact_email_to: str | None = None  # where visitor messages land

    # --- Login for the /admin dashboard ---
    admin_username: str | None = None
    admin_password: str | None = None

    @property
    def allowed_origins_list(self) -> list[str]:
        """Turn the comma-separated string into a clean list."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def github_allowed_repos_list(self) -> list[str]:
        """Turn the comma-separated string into a clean list."""
        return [repo.strip() for repo in self.github_allowed_repos.split(",") if repo.strip()]


# One shared settings object the whole app imports.
settings = Settings()

# Warn loudly if the signing key is auto-generated. Fine locally; in production it
# means a restart invalidates any draft mid-confirmation, and separate workers
# can't verify each other's drafts.
if "SECRET_KEY" not in os.environ or not os.environ["SECRET_KEY"].strip():
    logger.warning(
        "SECRET_KEY is not set — using a random key generated at startup. "
        "Set it explicitly in production."
    )
