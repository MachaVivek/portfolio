"""Fetching repo details straight from GitHub.

Deliberately live (not stored in the vector database) so repo info is always current
without having to re-index anything after a push.
"""

import httpx

from app.config import settings

GITHUB_API = "https://api.github.com"

# READMEs can be very long. Trimming keeps the AI prompt a sensible size and cost.
README_CHAR_LIMIT = 6000

# Give up rather than leaving a visitor waiting if GitHub is slow.
REQUEST_TIMEOUT_SECONDS = 10


def get_repo_details(repo_name: str) -> dict:
    """Get one repo's metadata and README.

    The caller checks the repo is on the allowlist before calling this.
    """
    headers = {"Accept": "application/vnd.github+json"}
    # A token isn't strictly required for public repos, but without one GitHub
    # limits you to 60 requests/hour instead of 5,000.
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"

    with httpx.Client(headers=headers, timeout=REQUEST_TIMEOUT_SECONDS) as client:
        repo_resp = client.get(f"{GITHUB_API}/repos/{settings.github_username}/{repo_name}")
        repo_resp.raise_for_status()  # turns a 404 etc. into an error the caller handles
        repo_data = repo_resp.json()

        # The "raw" Accept header asks for the README as plain text rather than
        # base64-encoded JSON.
        readme_resp = client.get(
            f"{GITHUB_API}/repos/{settings.github_username}/{repo_name}/readme",
            headers={**headers, "Accept": "application/vnd.github.raw"},
        )
        # A missing README isn't an error — plenty of repos don't have one.
        readme_text = readme_resp.text if readme_resp.status_code == 200 else ""

    return {
        "name": repo_data.get("name"),
        "description": repo_data.get("description"),
        "language": repo_data.get("language"),
        "topics": repo_data.get("topics", []),
        "url": repo_data.get("html_url"),
        "readme": readme_text[:README_CHAR_LIMIT],
    }
