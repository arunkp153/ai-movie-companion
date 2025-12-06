# backend/services/omdb_client.py
import os
import httpx
from typing import Optional, Dict

OMDB_KEY = os.getenv("OMDB_API_KEY")
BASE = "http://www.omdbapi.com/"

def _client():
    return httpx.Client(timeout=15.0)

def search_movies(query: str) -> Dict:
    """Search movies by title (OMDb 's' search)."""
    if not OMDB_KEY:
        return {"error": "OMDB_API_KEY not configured"}
    params = {"apikey": OMDB_KEY, "s": query}
    with _client() as c:
        r = c.get(BASE, params=params)
        try:
            return r.json()
        except Exception:
            return {"error": f"omdb_http_{r.status_code}"}

def get_movie_by_title(title: str) -> Dict:
    """Get movie details by exact title (t param)."""
    if not OMDB_KEY:
        return {"error": "OMDB_API_KEY not configured"}
    params = {"apikey": OMDB_KEY, "t": title, "plot": "full"}
    with _client() as c:
        r = c.get(BASE, params=params)
        try:
            return r.json()
        except Exception:
            return {"error": f"omdb_http_{r.status_code}"}

def get_movie_by_imdb_id(imdb_id: str) -> Dict:
    if not OMDB_KEY:
        return {"error": "OMDB_API_KEY not configured"}
    params = {"apikey": OMDB_KEY, "i": imdb_id, "plot": "full"}
    with _client() as c:
        r = c.get(BASE, params=params)
        try:
            return r.json()
        except Exception:
            return {"error": f"omdb_http_{r.status_code}"}
