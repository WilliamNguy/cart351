from flask import Flask,render_template,request
import os
app = Flask(__name__)


# the default route
@app.route("/")
def index():
      return render_template("index.html")

# *************************************************

# Task: Variables and JinJa Templates

@app.route("/t1")
def t1():
    the_topic = "donuts"
    number_of_donuts = 28
    donut_data = {
        "flavours": ["Regular", "Chocolate", "Blueberry", "Devil's Food", "Maple", "Strawberry"],
        "toppings": ["None", "Glazed", "Sugar", "Powdered Sugar",
            "Chocolate with Sprinkles", "Chocolate", "Maple"]
    }
    icecream_flavors = ["Vanilla", "Raspberry", "Cherry", "Lemon"]
    images = [
        "donut_a.png", "donut_b.png", "donut_c.png",
        "donut_d.png", "donut_e.png", "donut_f.png", "donut_pink.png", "donut_sprinkles.png"
    ]
    return render_template(
        "t1.html",
        the_topic=the_topic,
        number_of_donuts=number_of_donuts,
        donut_data=donut_data,
        icecream_flavors=icecream_flavors,
        images=images
    )

# *************************************************

# Task: HTML Form get & Data 
@app.route("/t2")
def t2():
    return render_template("t2.html")

@app.route("/thank_you_t2")
def thank_you_t2():
    first = request.args.get("first_name", "")
    last = request.args.get("last_name", "")
    message = request.args.get("message", "")

    combined = f"{first} {last} — {message}"
    vowels = "aeiouAEIOU"
    masked = "".join("*" if c in vowels else c for c in combined)

    return render_template("thankyou_t2.html", masked=masked)

# *************************************************

# run
app.run(debug=True)