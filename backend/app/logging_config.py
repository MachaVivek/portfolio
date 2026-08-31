"""Logging setup.

Logs go to standard output rather than a file, because that's what container
platforms expect — Render captures stdout and shows it in its dashboard.
"""

import logging


def setup_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        # e.g. "2026-08-22 16:47:35,440 INFO app.access POST /chat -> 200 (1.6ms) ip=..."
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
