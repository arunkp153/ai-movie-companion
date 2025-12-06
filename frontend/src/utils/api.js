// small helper to call backend; adjust base if needed
const BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export async function searchMovies(q) {
  const url = `${BASE}/movies/search?q=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  return r.json();
}

export async function getMovieDetails({ title, imdb_id }) {
  let url = `${BASE}/movies/details?title=${encodeURIComponent(title)}`;
  if (imdb_id) url = `${BASE}/movies/details?imdb_id=${encodeURIComponent(imdb_id)}`;
  const r = await fetch(url);
  return r.json();
}

export async function aiInsights(title, overview = "") {
  const url = `${BASE}/ai/insights`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, overview })
  });
  return r.json();
}
