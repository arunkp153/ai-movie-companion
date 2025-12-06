# backend/routers/ai.py
from fastapi import APIRouter, Body
from services.ai_client import generate_movie_insights

router = APIRouter()

@router.post("/insights")
def insights(payload: dict = Body(...)):
    """
    POST { "title": "...", "overview": "..." }
    Returns AI generated pitch, trivia and recommendations.
    """
    title = payload.get("title") or ""
    overview = payload.get("overview") or ""
    if not title:
        return {"ok": False, "error": "title required"}
    out = generate_movie_insights(title=title, overview=overview)
    return out
