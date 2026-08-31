"""The shapes of data going in and out of the API.

FastAPI uses these to validate incoming requests automatically — if a request
doesn't match, it's rejected with a clear error before our code ever runs.
"""

from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """One line of the conversation."""

    role: Literal["user", "assistant"]  # only these two values are accepted
    content: str


class ChatRequest(BaseModel):
    """What the frontend sends to /chat."""

    # The whole conversation so far, oldest first. The backend doesn't remember
    # anything between requests, so the frontend resends the full history each time.
    # Capped so nobody can send an enormous conversation to run up token costs.
    messages: list[ChatMessage] = Field(min_length=1, max_length=50)

    # An email draft waiting for a yes/no. The frontend just echoes back whatever
    # the previous response gave it. Signed by the server, so a made-up one is rejected.
    pending_action: dict | None = None

    # Ties messages together into one conversation in the database. Comes back in
    # the first response; the frontend sends it with every message after that.
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    """What /chat sends back."""

    reply: str
    pending_action: dict | None = None
    conversation_id: str | None = None

    # Which tools the agent used to answer, in the order they ran — e.g.
    # ["portfolio_search"] or ["github_repo_info"]. The frontend uses this to
    # show the matching character animation. Empty when no tool was needed.
    tools_used: list[str] = Field(default_factory=list)
