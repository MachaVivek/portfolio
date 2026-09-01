from typing import Literal

from pydantic import BaseModel, Field

class ChatMessage(BaseModel):

    role: Literal["user", "assistant"]                                      
    content: str

class ChatRequest(BaseModel):

    messages: list[ChatMessage] = Field(min_length=1, max_length=50)

    pending_action: dict | None = None

    conversation_id: str | None = None

class ChatResponse(BaseModel):

    reply: str
    pending_action: dict | None = None
    conversation_id: str | None = None

    tools_used: list[str] = Field(default_factory=list)

class ContactFormRequest(BaseModel):

    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    message: str = Field(min_length=1, max_length=3000)
