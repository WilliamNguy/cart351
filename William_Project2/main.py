import json, os
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DATA_DIR = os.path.join(app.root_path, "data")
DATA_FILE = os.path.join(DATA_DIR, "scores.json")

def ensure_json():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)

def read_all():
    ensure_json()
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def write_all(items):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

@app.route("/")
def index():
    return render_template("index.html", site_title="Click Fast")

@app.get("/api/data")
def api_data():
    items = read_all()
    fastest = sorted(items, key=lambda x: x.get("ms", 999999))[:10]
    latest = sorted(items, key=lambda x: x.get("ts", ""), reverse=True)[:10]
    return jsonify({"ok": True, "items": items, "fastest": fastest, "latest": latest})

@app.post("/api/submit")
def api_submit():
    ensure_json()    
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()[:24]
    ms = data.get("ms")

    if not name:
        return jsonify({"ok": False, "error": "enter a name"}), 400

    #(just to avoid cheating)
    if ms < 50:
        return jsonify({"ok": False, "error": "too fast (probably a misclick)"}), 400

    entry = {
        "name": name,
        "ms": ms,
        "ts": datetime.utcnow().isoformat() + "Z"
    }

    items = read_all()
    items.append(entry)
    write_all(items)
    return jsonify({"ok": True, "entry": entry})

if __name__ == "__main__":
    app.run(debug=True)
