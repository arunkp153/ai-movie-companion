import React, { useState } from "react";
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage";

/* Minimal theme */
const theme = {
  bg: "#0f1724",       // deep navy
  card: "#0f1b2d",     // slightly lighter card
  accent: "#ff6b6b",   // coral accent
  text: "#e6eef8",     // soft white
  muted: "#9fb0c8"     // muted text
};

export const ThemeContext = React.createContext(theme);

export default function App() {
  const [route, setRoute] = useState({ name: "home", params: {} });

  const goToMovie = (movie) => setRoute({ name: "movie", params: { movie } });
  const goHome = () => setRoute({ name: "home", params: {} });

  const containerStyle = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${theme.bg} 0%, #071025 100%)`,
    color: theme.text,
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    padding: 20
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={containerStyle}>
        {route.name === "home" && <Home onOpenMovie={goToMovie} />}
        {route.name === "movie" && (
          <MoviePage movie={route.params.movie} onBack={goHome} />
        )}
        <footer style={{
          marginTop: 30,
          color: theme.muted,
          fontSize: 12,
          textAlign: "center"
        }}>
          AI Movie Companion — demo • data from your backend
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}
