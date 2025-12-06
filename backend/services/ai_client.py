# backend/services/ai_client.py
import os
import httpx
import json
from datetime import datetime
from typing import Dict, Any, Optional

AI_PROVIDER = os.getenv("AI_PROVIDER", "groq").lower()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "groq-compound")  # can be wrong; client will try to auto-discover
GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models"

def _fallback(title: str) -> Dict[str, Any]:
    return {
        "ok": True,
        "model": "fallback",
        "data": {
            "pitch": f"(AI not configured) Example pitch for {title}",
            "trivia": [
                "AI not configured — provide GROQ_API_KEY.",
                "This is demo fallback trivia.",
                "Enable Groq credentials for real suggestions."
            ],
            "recommendations": []
        },
        "as_of": datetime.utcnow().date().isoformat(),
        "verified": False,
        "sources": []
    }

def _extract_json_from_text(txt: str) -> Optional[Dict]:
    try:
        start = txt.index("{")
        end = txt.rindex("}") + 1
        candidate = txt[start:end]
        return json.loads(candidate)
    except Exception:
        try:
            return json.loads(txt)
        except Exception:
            return None

def _get_text_from_choice(resp_json: Dict) -> Optional[str]:
    # OpenAI-compatible responses: choices[0].message.content or choices[0].text
    try:
        choices = resp_json.get("choices", [])
        if choices:
            first = choices[0]
            # chat-style
            msg = first.get("message") or first.get("message", {})
            if isinstance(msg, dict):
                # msg content might be 'content' or a direct string
                content = msg.get("content")
                if isinstance(content, str):
                    return content
                # content could be list -> join
                if isinstance(content, list):
                    return "\n".join(str(x) for x in content)
            # fallback to 'text' key
            if "text" in first and isinstance(first["text"], str):
                return first["text"]
        # fallback: search for any string in response
        def collect_strings(x):
            out = []
            if isinstance(x, dict):
                for v in x.values():
                    if isinstance(v, str): out.append(v)
                    elif isinstance(v, (dict, list)): out += collect_strings(v)
            elif isinstance(x, list):
                for it in x: out += collect_strings(it)
            return out
        strings = collect_strings(resp_json)
        return strings[0] if strings else None
    except Exception:
        return None

def _fetch_available_model(api_key: str) -> Optional[str]:
    """Query Groq models endpoint and return the first model id (or None)."""
    if not api_key:
        return None
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        with httpx.Client(timeout=20.0) as client:
            r = client.get(GROQ_MODELS_URL, headers=headers)
            if r.status_code != 200:
                return None
            j = r.json()
            # j expected to contain 'data' list with model objects that have 'id' or 'model' keys
            models = j.get("data") or j.get("models") or []
            if not models:
                return None
            # pick first model id we can find
            for m in models:
                if isinstance(m, dict):
                    for key in ("id", "model", "name"):
                        if key in m and isinstance(m[key], str):
                            return m[key]
            # fallback: if models is list of strings
            if isinstance(models, list) and models and isinstance(models[0], str):
                return models[0]
    except Exception:
        return None
    return None

def generate_movie_insights(title: str, overview: str = "") -> Dict[str, Any]:
    if AI_PROVIDER != "groq" or not GROQ_API_KEY:
        return _fallback(title)

    model_to_try = GROQ_MODEL
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}

    system_prompt = (
        "You are an expert movie writer and recommender. "
        "Produce only valid JSON with keys: pitch (string), trivia (array of 3 strings), "
        "recommendations (array of 2 objects {title, why}). Return JSON only."
    )
    user_prompt = (
        f"Movie title: \"{title}\". Overview: \"{overview or 'N/A'}\". Return JSON only."
    )

    payload = {
        "model": model_to_try,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 600,
        "temperature": 0.6,
        "n": 1
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            r = client.post(GROQ_CHAT_URL, headers=headers, json=payload)
            if r.status_code == 404:
                # try to auto-discover a model from /models
                discovered = _fetch_available_model(GROQ_API_KEY)
                if discovered and discovered != model_to_try:
                    # retry once with discovered model
                    payload["model"] = discovered
                    r2 = client.post(GROQ_CHAT_URL, headers=headers, json=payload)
                    try:
                        j2 = r2.json()
                    except Exception:
                        return {"ok": False, "error": f"groq_http_{r2.status_code}", "raw": r2.text}
                    gen_text = _get_text_from_choice(j2)
                    if gen_text:
                        parsed = _extract_json_from_text(gen_text)
                        if parsed:
                            parsed.setdefault("as_of", datetime.utcnow().date().isoformat())
                            parsed.setdefault("verified", False)
                            parsed.setdefault("sources", ["groq"])
                            return {"ok": True, "data": parsed}
                        return {"ok": True, "data": {"pitch_or_raw_text": gen_text, "used_model": discovered}}
                    return {"ok": False, "error": f"groq_http_{r2.status_code}", "raw": r2.text}
                else:
                    return {"ok": False, "error": "model_not_found", "note": "Configured model not found and auto-discovery failed."}
            if r.status_code != 200:
                return {"ok": False, "error": f"groq_http_{r.status_code}", "raw": r.text}
            try:
                j = r.json()
            except Exception:
                return {"ok": False, "error": "invalid_json_response", "raw": r.text}

            gen_text = _get_text_from_choice(j)
            if gen_text:
                parsed = _extract_json_from_text(gen_text)
                if parsed:
                    parsed.setdefault("as_of", datetime.utcnow().date().isoformat())
                    parsed.setdefault("verified", False)
                    parsed.setdefault("sources", ["groq"])
                    return {"ok": True, "data": parsed}
                return {"ok": True, "data": {"pitch_or_raw_text": gen_text, "used_model": model_to_try}}
            return {"ok": True, "data": {"raw_response": j}}
    except Exception as e:
        return {"ok": False, "error": str(e)}
