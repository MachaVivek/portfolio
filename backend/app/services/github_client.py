from functools import lru_cache
import httpx

from app.config import settings
from app.constants import (
    DEFAULT_HTTP_TIMEOUT_SECONDS,
    GITHUB_API_URL,
    GITHUB_README_CHAR_LIMIT,
)

@lru_cache(maxsize=1)
def _get_http_client() -> httpx.Client:
    headers = {"Accept": "application/vnd.github+json"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    return httpx.Client(
        headers=headers,
        timeout=DEFAULT_HTTP_TIMEOUT_SECONDS,
        limits=httpx.Limits(max_keepalive_connections=5, max_connections=10),
    )

def get_repo_details(repo_name: str) -> dict:
    client = _get_http_client()
    repo_resp = client.get(f"{GITHUB_API_URL}/repos/{settings.github_username}/{repo_name}")
    repo_resp.raise_for_status()                                                     
    repo_data = repo_resp.json()

    readme_resp = client.get(
        f"{GITHUB_API}/repos/{settings.github_username}/{repo_name}/readme",
        headers={"Accept": "application/vnd.github.raw"},
    )

    readme_text = readme_resp.text if readme_resp.status_code == 200 else ""

    return {
        "name": repo_data.get("name"),
        "description": repo_data.get("description"),
        "language": repo_data.get("language"),
        "topics": repo_data.get("topics", []),
        "url": repo_data.get("html_url"),
        "readme": readme_text[:README_CHAR_LIMIT],
    }
