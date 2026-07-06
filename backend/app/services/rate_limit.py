import os
import redis

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
RATE_LIMIT_REQUESTS = 10   # max requests
RATE_LIMIT_WINDOW = 60     # per 60 seconds

r = redis.from_url(REDIS_URL, decode_responses=True)


def check_rate_limit(client_id: str) -> tuple[bool, int]:
    """
    Check if client has exceeded rate limit.
    Returns (is_allowed, requests_remaining).
    Uses Redis sliding window counter.
    """
    key = f"rate_limit:{client_id}"

    current = r.get(key)

    if current is None:
        # First request — set counter with expiry
        r.setex(key, RATE_LIMIT_WINDOW, 1)
        return True, RATE_LIMIT_REQUESTS - 1

    count = int(current)

    if count >= RATE_LIMIT_REQUESTS:
        return False, 0

    r.incr(key)
    return True, RATE_LIMIT_REQUESTS - count - 1