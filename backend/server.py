import os
import openai
from flask import Flask, request, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")


# Define routes
@app.route("/openai", methods=["GET", "POST"])
def openai_endpoint():
    if request.method == "POST":
        data = request.get_json()

        currentLocation = data["currentLocation"]
        desiredLocation = data["desiredLocation"]
        days = data["days"]
        activities = data["activities"]
        date = data["startDate"]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=generate_message(
                currentLocation, desiredLocation, days, activities, date
            ),
        )
        result = response["choices"][0]["message"]["content"]
        print(result)
        return result
    return "hi"


def generate_message(currentLocation, desiredLocation, days, activities, date):
    return [
        {   "role": "system", 
            "content": "You are a travel planning assisnant. "
            + "Generate a list of 2-3 travel destinations I can go to similar to the place the user mentioned. "
            + "For example, if the user likes Hawaii, suggest places like Cancun, the Caribbeans, etc. "
            + "Format it so that each different place I can visit is one a new line. "
            + "Also, number each item 'ONE. ', 'TWO. ', 'THREE. ' ..."
            + "For each destination, generate a list of places to visit each day, one place for each day "
            + "(for example, if there are n days there should be n places for each destination) "
            + "Format each list item on a new line, starting with 'DAY 1: ', 'DAY 2: ', etc. "
            + "For example, if days == 1, you should have 'DAY 1: '; if days == 5, you should have 'DAY 1: ', 'DAY 2: ', 'DAY 3: ', 'DAY 4: ', 'DAY 5: '"
            + "Here is an example for days == 3 and a user inputted location of 'Hawaii': "
            + "ONE. Hawaii: \n"
            + "DAY 1: Hawaii Volcanoes National Park \n"
            + "DAY 2: Polynesian Cultural Center \n"
            + "DAY 3: Pearl Harbor \n"
            + "TWO. Cancun: \n"
            + "DAY 1: Chichen Itza"
            + "DAY 2: Tulum Mayan Ruins"
            + "DAY 3: Bacalar Lake"
        },
        {
            "role": "user",
            "content": "I live at "
            + currentLocation
            + " and I am currently planning a vacation trip that will span "
            + days
            + " days and begins on "
            + date
        },
        {
            "role": "user",
            "content": "An example of a location I would like to visit is "
            + desiredLocation,
        },
        {
            "role": "user",
            "content": "I would like to do these activities: " 
            + ",".join(activities),
        },
    ]


if __name__ == "__main__":
    app.run(debug=True, port=5002)
