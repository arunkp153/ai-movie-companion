
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../utils/api";

export default function Home({ onOpenMovie }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const onSearch = async (q) => {
    if (!q || q.trim().length < 1) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchMovies(q);
      if (res && res.data && res.data.Search) {
        setResults(res.data.Search);
      } else if (res && res.data && res.data.Response === "False") {
        setResults([]);
        setError(res.data.Error || "No results");
      } else {
        setResults([]);
        setError("No results");
      }
    } catch (e) {
      setError("Network error");
    }
    setLoading(false);
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 18,
    marginTop: 12
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>AI Movie Companion</h1>
      <p style={{ color: "#9fb0c8", marginTop: 0 }}>Search movies and ask the AI for pitch, trivia and recommendations.</p>

      <SearchBar onSearch={onSearch} />

      {loading && <div style={{ color: "#9fb0c8" }}>Searching...</div>}
      {error && <div style={{ color: "#ff9b9b" }}>{error}</div>}

      <div style={grid}>
        {results.map((r) => (
          <MovieCard key={r.imdbID || r.id || r.Title} item={r} onOpen={onOpenMovie} />
        ))}
      </div>
    </div>
  );
}
