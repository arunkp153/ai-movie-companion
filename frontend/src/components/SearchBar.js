
import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";

export default function SearchBar({ onSearch }) {
  const theme = useContext(ThemeContext);
  const [q, setQ] = useState("");

  const container = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 18
  };
  const input = {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    color: theme.text,
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
    fontSize: 16
  };
  const button = {
    padding: "10px 14px",
    borderRadius: 10,
    background: theme.accent,
    color: "#082027",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform .12s ease"
  };

  return (
    <div style={container}>
      <input
        aria-label="search"
        style={input}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSearch(q); }}
        placeholder="Search movies (title or keywords)..."
      />
      <button
        style={button}
        onClick={() => onSearch(q)}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Search
      </button>
    </div>
  );
}
