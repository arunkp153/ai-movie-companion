# backend/models/movie_models.py
from pydantic import BaseModel
from typing import Optional, List, Any

class OMDbSearchResult(BaseModel):
    Search: Optional[List[Any]]
    totalResults: Optional[str]
    Response: str

class OMDbMovieDetails(BaseModel):
    Title: Optional[str]
    Year: Optional[str]
    Rated: Optional[str]
    Released: Optional[str]
    Runtime: Optional[str]
    Genre: Optional[str]
    Director: Optional[str]
    Writer: Optional[str]
    Actors: Optional[str]
    Plot: Optional[str]
    Language: Optional[str]
    Country: Optional[str]
    Awards: Optional[str]
    Poster: Optional[str]
    Ratings: Optional[List[dict]]
    Metascore: Optional[str]
    imdbRating: Optional[str]
    imdbVotes: Optional[str]
    imdbID: Optional[str]
    Type: Optional[str]
    Response: Optional[str]
