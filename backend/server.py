import os
import openai
import json
from flask import Flask, request, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS


app = Flask(__name__)
openai.api_key = "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"
# os.getenv("OPENAI_API_KEY")
CORS(app)


# Define routes


@app.route("/openai", methods=["GET", "POST"])
def openai_endpoint():
    if request.method == "POST":
        data = request.get_json()

        currentLocation = data["currentLocation"]
        desiredLocation = data["desiredLocation"]
        days = data["days"]
        activities = data["activities"]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=generate_message(
                currentLocation, desiredLocation, days, activities
            ),
        )
        result = response["choices"][0]["message"]["content"]
        print(result)
        return result
    return "hi"


def generate_message(currentLocation, desiredLocation, days, activities):
    return [
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "I live at "
            + currentLocation
            + "and I am currently planning a vacation trip that will span"
            + days
            + "days",
        },
        {
            "role": "user",
            "content": "An example of a location I would like to visit is"
            + desiredLocation,
        },
        {
            "role": "user",
            "content": "I would like to do these activities: " + ",".join(activities),
        },
    ]


if __name__ == "__main__":
    app.run(debug=True, port=5002)
