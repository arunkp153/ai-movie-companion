🎬 AI Movie Companion – Movie Search + AI Insights App

An intelligent movie discovery app built with FastAPI (backend) and React (frontend).
Search any movie using the OMDb API, and get AI-generated insights powered by Groq (LLaMA-3) such as:

✨ One-sentence movie pitch
✨ Interesting trivia
✨ Smart movie recommendations
✨ Clean UI with animations
✨ Modern, minimal design

🚀 Features

🔍 Movie Search — Powered by the free OMDb API

🤖 AI Insights — Groq LLaMA-3 generates:

Pitch (one-sentence description)

Trivia / Fun facts

Personalized recommendations

🎨 Modern Frontend — React UI with smooth animations

⚡ Fast Backend — FastAPI + async requests

🔐 Secure — API keys stored in .env (ignored from Git)

🛠️ Tech Stack

Frontend: React (CRA), JavaScript, CSS animations

Backend: FastAPI, Python, httpx

AI Model: Groq LLaMA-3 via Groq API

Movie Data: OMDb API

Other: Git, Environment Variables, Axios


📦 Folder Structure
ai-movie-companion/
  backend/
    app.py
    services/
    routers/
    models/
    .env (ignored)
  frontend/
    src/
      components/
      pages/
      App.js
      App.css
    .env (ignored)



🔐 Environment Variables
OMDB_API_KEY=your_key_here
GROQ_API_KEY=your_groq_key_here


🧪 API Endpoints
GET /movies/search?title=Inception

Search for movies

GET /movies/details?id=tt1375666

Movie details

POST /ai/insights

AI-generated pitch, trivia, recommendation
