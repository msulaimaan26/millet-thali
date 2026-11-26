"""Flask backend for Millet Thali. Works locally (Ollama) and on Vercel (hosted LLM API)."""
import json, os, requests
from flask import Flask, request, jsonify, send_from_directory

BASE = os.path.dirname(os.path.abspath(__file__))
IKS = json.load(open(os.path.join(BASE, "iks.json"), encoding="utf-8"))
app = Flask(__name__)

# Local Ollama (used when LLM_API_KEY is not set)
OLLAMA = os.getenv("OLLAMA_URL", "http://localhost:11434")
MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")
# Hosted model (used on Vercel). Any OpenAI-compatible API works, e.g. Groq.
LLM_URL = os.getenv("LLM_API_URL", "https://api.groq.com/openai/v1/chat/completions")
LLM_KEY = os.getenv("LLM_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")

SYSTEM = f"""You are 'Millet Thali', an assistant on Indian traditional grain nutrition.
Ground every traditional (IKS) claim ONLY in this knowledge base, and name the source when you use it:
{json.dumps(IKS, ensure_ascii=False)}
Rules: build meals from ragi, jowar or bajra + a local pulse + seasonal vegetables. Respect the user's season,
region and health needs. Reply in under 200 words: Breakfast, Lunch, Dinner (one line each), then 'Why (IKS)' in 2 lines.
Give no medical claims; for health conditions advise consulting a doctor or dietitian."""

@app.post("/api/chat")
def chat():
    d = request.get_json(force=True)
    ctx = f"Season: {d.get('season')}. Preferred millet: {d.get('grain')}. Preferred pulse: {d.get('pulse')}."
    msgs = [{"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"{ctx}\nQuestion: {d.get('question', '')[:600]}"}]
    try:
        if LLM_KEY:
            r = requests.post(LLM_URL, headers={"Authorization": f"Bearer {LLM_KEY}"},
                              json={"model": LLM_MODEL, "messages": msgs}, timeout=60)
            r.raise_for_status()
            return jsonify(answer=r.json()["choices"][0]["message"]["content"])
        r = requests.post(f"{OLLAMA}/api/chat", json={"model": MODEL, "stream": False, "messages": msgs}, timeout=180)
        r.raise_for_status()
        return jsonify(answer=r.json()["message"]["content"])
    except Exception as e:
        return jsonify(error=f"AI model not reachable. Check your API key or Ollama. ({e})"), 503

# Local development only: on Vercel the public/ folder is served by the CDN.
if not os.getenv("VERCEL"):
    PUB = os.path.join(BASE, "public")
    @app.get("/")
    def home(): return send_from_directory(PUB, "index.html")
    @app.get("/<path:p>")
    def files(p): return send_from_directory(PUB, p)

if __name__ == "__main__":
    print("Open http://127.0.0.1:5000", "(hosted model)" if LLM_KEY else f"(Ollama: {MODEL})")
    app.run(port=5000, debug=True)
