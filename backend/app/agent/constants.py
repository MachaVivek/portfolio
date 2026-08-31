"""Shared settings for the AI agent.

The model name itself lives in services/gemini_client.py, alongside the rest of
the Gemini setup.
"""

# How many times the agent may call tools before it has to give a final answer.
# Stops a confused model from looping forever and burning tokens.
MAX_TOOL_ROUNDS = 3
