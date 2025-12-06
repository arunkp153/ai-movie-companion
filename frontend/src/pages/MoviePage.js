
import React, { useState, useEffect } from "react";
import { getMovieDetails, aiInsights } from "../utils/api";

export default function MoviePage({ movie, onBack }) {
  // movie might be OMDb result (contains Title) or custom object
  const title = movie.Title || movie.title || movie.name || "Unknown";
  const [details, setDetails] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMovieDetails({ title, imdb_id: movie.imdbID })
      .then((r) => {
        if (!mounted) return;
        setDetails(r.data || r);
      })
      .catch(() => setError("Failed to fetch details"))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [movie, title]);

  const requestAI = async () => {
    setAiLoading(true);
    try {
      const r = await aiInsights(title, (details && details.Plot) || "");
      if (r && r.ok && r.data) {
        setAiData(r.data);
      } else {
        setAiData({ pitch_or_raw_text: r.commentary || r.data || "No AI data" });
      }
    } catch (e) {
      setAiData({ pitch_or_raw_text: "AI request failed" });
    }
    setAiLoading(false);
  };

  const wrap = { display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 };
  const left = { background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 12 };
  const right = { background: "rgba(255,255,255,0.01)", padding: 14, borderRadius: 12 };

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 12, background: "none", color: "#9fb0c8", border: "none", cursor: "pointer" }}>
        ← Back to search
      </button>

      <div style={wrap}>
        <div style={left}>
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          {loading && <div style={{ color: "#9fb0c8" }}>Loading details...</div>}
          {error && <div style={{ color: "#ff9b9b" }}>{error}</div>}
          {details && (
            <div>
              <div style={{ display: "flex", gap: 12 }}>
                <img src={details.Poster && details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/300x430?text=No+Poster"} alt={title} style={{ width: 180, borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#9fb0c8", marginBottom: 8 }}>{details.Genre}</div>
                  <div style={{ marginBottom: 10 }}>{details.Plot}</div>
                  <div style={{ color: "#cfe7ff", fontSize: 13 }}>
                    <strong>{details.imdbRating || details.imdbRating}</strong> IMDb
                    {details.Runtime ? ` • ${details.Runtime}` : ""}
                    {details.Released ? ` • ${details.Released}` : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <button onClick={requestAI} disabled={aiLoading} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#ff6b6b", color: "#031a1c", cursor: "pointer" }}>
              {aiLoading ? "Generating..." : "Ask AI for pitch & trivia"}
            </button>
          </div>
        </div>

        <div style={right}>
          <h3 style={{ marginTop: 0 }}>AI Insights</h3>
          {!aiData && <div style={{ color: "#9fb0c8" }}>No AI data yet. Click the button to generate.</div>}
          {aiData && aiData.pitch && (
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{aiData.pitch}</div>
              <div style={{ color: "#9fb0c8", marginBottom: 8 }}>Trivia</div>
              <ul style={{ marginTop: 0 }}>
                {Array.isArray(aiData.trivia) ? aiData.trivia.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>) : <li>{aiData.trivia}</li>}
              </ul>
              <div style={{ color: "#9fb0c8", marginBottom: 8 }}>Recommendations</div>
              <ul style={{ marginTop: 0 }}>
                {Array.isArray(aiData.recommendations) ? aiData.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 700 }}>{rec.title}</div>
                    <div style={{ color: "#9fb0c8" }}>{rec.why}</div>
                  </li>
                )) : <li>{JSON.stringify(aiData.recommendations)}</li>}
              </ul>
            </div>
          )}
          {aiData && aiData.pitch_or_raw_text && (
            <div style={{ whiteSpace: "pre-wrap" }}>{aiData.pitch_or_raw_text}</div>
          )}
        </div>
      </div>
    </div>
  );
}
