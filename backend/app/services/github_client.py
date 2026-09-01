import httpx

from app.config import settings

GITHUB_API = "https://api.github.com"

README_CHAR_LIMIT = 6000

REQUEST_TIMEOUT_SECONDS = 10

def get_repo_details(repo_name: str) -> dict:
    headers = {"Accept": "application/vnd.github+json"}

    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"

    with httpx.Client(headers=headers, timeout=REQUEST_TIMEOUT_SECONDS) as client:
        repo_resp = client.get(f"{GITHUB_API}/repos/{settings.github_username}/{repo_name}")
        repo_resp.raise_for_status()                                                     
        repo_data = repo_resp.json()

        readme_resp = client.get(
            f"{GITHUB_API}/repos/{settings.github_username}/{repo_name}/readme",
            headers={**headers, "Accept": "application/vnd.github.raw"},
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
