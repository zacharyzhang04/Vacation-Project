import os
import openai
from flask import Flask, request, jsonify, redirect, render_template, request, url_for


app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")


# Define routes
@app.route("/", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        address = request.form["address"]
        days = request.form["days"]
        activities = ["snorkeling", "playing on the beach"]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=generate_message(address, days, activities)
        )
        return redirect(
            url_for("index", result=response["choices"][0]["message"]["content"])
        )

    result = request.args.get("result")
    return render_template("index.html", result=result)


def generate_message(address, days, activities):
    return [
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "I live in {address} and I am currently planning a vacation trip that will span {days} days",
        },
        {
            "role": "user",
            "content": "Suggest the top 5 locations I could visit for my vacation trip.",
        },
    ]


if __name__ == "__main__":
    app.run(debug=True, port=5002)
