
import React, { useContext } from "react";
import { ThemeContext } from "../App";

export default function MovieCard({ item, onOpen }) {
  const theme = useContext(ThemeContext);
  const card = {
    width: 180,
    borderRadius: 12,
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    boxShadow: "0 6px 20px rgba(2,6,23,0.6)",
    color: theme.text,
    cursor: "pointer",
    transition: "transform .18s ease, box-shadow .18s ease"
  };
  const poster = {
    width: "100%",
    height: 270,
    objectFit: "cover",
    display: "block",
    background: "#06111a"
  };
  const body = {
    padding: 12
  };
  const titleStyle = { fontSize: 14, fontWeight: 700, marginBottom: 6 };
  const meta = { fontSize: 12, color: theme.muted };

  return (
    <div
      style={card}
      onClick={() => onOpen(item)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(2,6,23,0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(2,6,23,0.6)";
      }}
    >
      <img
        alt={item.Title || item.title}
        src={item.Poster && item.Poster !== "N/A" ? item.Poster : `https://via.placeholder.com/300x430?text=No+Poster`}
        style={poster}
      />
      <div style={body}>
        <div style={titleStyle}>{item.Title || item.title}</div>
        <div style={meta}>{item.Year || item.year} • {item.Type || item.type || "movie"}</div>
      </div>
    </div>
  );
}
