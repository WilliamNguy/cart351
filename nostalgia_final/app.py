from flask import Flask, render_template, request
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb+srv://signupwilliam123:Cart351@willluu.fmwmgpy.mongodb.net/cart351?retryWrites=true&w=majority"

mongo = PyMongo(app)

# 10 questions + optional weights
questions = [
    {
        "text": "What kind of childhood activity feels most nostalgic?",
        "choices": [
            ("0-17", 2, "Playing outside / cartoons"),
            ("18-30", 1, "Teen music / early internet"),
            ("31-50", 1, "School/work balance"),
            ("51+", 3, "Radio shows / classic hobbies")
        ]
    },
    {
        "text": "Which technology era feels closest to your memories?",
        "choices": [
            ("0-17", 1, "iPad / YouTube"),
            ("18-30", 2, "Flip phone / MySpace"),
            ("31-50", 2, "Walkman / VHS tapes"),
            ("51+", 3, "Record players / analog TV")
        ]
    },
    {
        "text": "Which type of music brings nostalgia?",
        "choices": [
            ("0-17", 1, "Kids pop / Disney"),
            ("18-30", 2, "2000s pop / early rap"),
            ("31-50", 3, "90s hits / classic rock"),
            ("51+", 3, "Oldies / jazz / vinyl")
        ]
    },
    {
        "text": "Your nostalgic comfort food:",
        "choices": [
            ("0-17", 2, "Chicken nuggets / cereal"),
            ("18-30", 2, "Instant noodles / cafeteria food"),
            ("31-50", 2, "Diner meals / lunchboxes"),
            ("51+", 3, "Home-cooked classics")
        ]
    },
    {
        "text": "Which toy/device feels most familiar?",
        "choices": [
            ("0-17", 1, "iPad / Switch / Roblox"),
            ("18-30", 2, "DS / PSP / GameCube"),
            ("31-50", 3, "NES / Sega / Yo-yos"),
            ("51+", 3, "Wooden toys / analog games")
        ]
    },
    {
        "text": "Which memory vibe matches you?",
        "choices": [
            ("0-17", 1, "Bright, playful, colorful"),
            ("18-30", 1, "Edgy, aesthetic, early internet"),
            ("31-50", 2, "Work-life nostalgia / calm"),
            ("51+", 3, "Slow, warm, analog")
        ]
    },
    {
        "text": "Which screen/media era feels like home?",
        "choices": [
            ("0-17", 2, "YouTube Kids / TikTok"),
            ("18-30", 2, "Tumblr / early YouTube"),
            ("31-50", 3, "Cable TV / early computers"),
            ("51+", 3, "Black & white TV / radio")
        ]
    },
    {
        "text": "Pick a nostalgic place:",
        "choices": [
            ("0-17", 2, "Playground"),
            ("18-30", 1, "Mall / hangouts"),
            ("31-50", 2, "Office / workplace routines"),
            ("51+", 3, "Family home / countryside")
        ]
    },
    {
        "text": "What nostalgia sensory vibe hits you?",
        "choices": [
            ("0-17", 2, "Candy / toys / bright colours"),
            ("18-30", 2, "Perfume / malls / school hallways"),
            ("31-50", 2, "Old computers / paper smell"),
            ("51+", 3, "Bookstores / old radios")
        ]
    },
    {
        "text": "Your nostalgic emotional tone:",
        "choices": [
            ("0-17", 1, "Imaginative & playful"),
            ("18-30", 2, "Finding identity / chaotic fun"),
            ("31-50", 3, "Responsibility / stability"),
            ("51+", 3, "Reflective / sentimental")
        ]
    }
]



@app.route("/quiz")
def quiz():
    return render_template("quiz.html", questions=questions)


@app.route("/submitQuiz", methods=["POST"])
def submitQuiz():
    scores = {
        "0-17": 0,
        "18-30": 0,
        "31-50": 0,
        "51+": 0
    }

    # Loop through questions
    for i, q in enumerate(questions, start=1):

        selected = request.form.get(f"q{i}")

        if not selected:
            continue

        # find matching choice
        for eraValue, weight, label in q["choices"]:
            if eraValue == selected:
                scores[eraValue] += weight

    finalEra = max(scores, key=scores.get)

    mongo.db.nostalgiaQuiz.insert_one({
        "answers": dict(request.form),
        "resultEra": finalEra
    })

    return render_template("quizResult.html", era=finalEra)


@app.route("/stats")
def stats():
    # Fetch all results
    all_results = list(mongo.db.nostalgiaQuiz.find({}, {"_id": 0}))

    # Count of each era
    counts = {
        "0-17": 0,
        "18-30": 0,
        "31-50": 0,
        "51+": 0
    }

    for r in all_results:
        era = r.get("resultEra")
        if era in counts:
            counts[era] += 1

    total = sum(counts.values())

    return render_template("stats.html", counts=counts, total=total)


@app.route("/screen/<era>")
def screen(era):
    template_map = {
        "0-17": "screen_0_17.html",
        "18-30": "screen_18_30.html",
        "31-50": "screen_31_50.html",
        "51+":  "screen_51_plus.html"
    }
    if era not in template_map:
        return "Invalid era", 404
    return render_template(template_map[era])


@app.route("/")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)