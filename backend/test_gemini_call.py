# backend/test_gemini_call.py
import os, httpx, json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_KEY_HERE")  # replace or set in .env
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5")
url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

body = {
    "contents": [
        {
            "parts": [
                {"text": "Write a one-sentence pitch for the movie Inception."}
            ]
        }
    ]
}

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY
}

print("URL:", url)
print("Headers:", {k: ("<hidden>" if k.lower().find("key")>=0 or k.lower().find("auth")>=0 else v) for k,v in headers.items()})
print("Body:", body)

try:
    with httpx.Client(timeout=30.0) as client:
        r = client.post(url, headers=headers, json=body)
        print("STATUS:", r.status_code)
        # try pretty JSON
        try:
            print("JSON RESPONSE:", json.dumps(r.json(), indent=2, ensure_ascii=False)[:4000])
        except Exception:
            print("RAW RESPONSE:", r.text[:4000])
except Exception as e:
    print("EXCEPTION:", str(e))
