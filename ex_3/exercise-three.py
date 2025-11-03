from flask import Flask,render_template,request
import json
import os
app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads' # Or os.path.join(app.instance_path, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB limit

# the default route
@app.route("/")
def index():
      return render_template("index.html")

#*************************************************
#Task: CAPTURE & POST & FETCH & SAVE
@app.route("/t2")
def t2():
    return render_template("t2.html")

@app.route("/postDataFetch", methods=['POST'])
def postDataFetch():
    data = request.get_json(silent=True) or {}
    os.makedirs("files", exist_ok=True)
    with open("files/data.txt", "a", encoding="utf-8") as f:
        f.write(json.dumps(data, ensure_ascii=False) + "\n")
    return {"ok": True, "msg": "Saved!"}

#*************************************************
#run
app.run(debug=True)
