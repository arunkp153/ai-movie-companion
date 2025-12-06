# backend/routers/movies.py
from fastapi import APIRouter, Query
from services import omdb_client

router = APIRouter()

@router.get("/search")
def search(q: str = Query(..., min_length=1)):
    """
    Search movies by title (OMDb 's' search parameter 's').
    """
    res = omdb_client.search_movies(q)
    return {"ok": True, "query": q, "data": res}

@router.get("/details")
def details(title: str = Query(None), imdb_id: str = Query(None)):
    """
    Get movie details by title (t=) or imdb id (i=). Prefer imdb_id if provided.
    """
    if imdb_id:
        res = omdb_client.get_movie_by_imdb_id(imdb_id)
    elif title:
        res = omdb_client.get_movie_by_title(title)
    else:
        return {"ok": False, "error": "title or imdb_id required"}
    return {"ok": True, "data": res}
