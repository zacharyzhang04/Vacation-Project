import os
import openai
from flask import Flask, request, jsonify, redirect, render_template, url_for
from flask_cors import CORS
import googlemaps
from geopy.geocoders import Nominatim
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
gmaps_api_key = os.getenv("GMAPS_API_KEY")
gmaps = googlemaps.Client(gmaps_api_key)


# GMAPS
@app.route("/api/restaurants", methods=["POST"])
def get_top_restaurants():
    location = request.args.get("location")

    # Get the latitude and longitude of the location
    geolocator = Nominatim(user_agent="my-app")
    location_data = geolocator.geocode(location)

    if location_data:
        latitude, longitude = location_data.latitude, location_data.longitude
        search_radius = 5000

        # Perform the nearby search for restaurants and get the top 3 locations
        top_restaurants = search_restaurants((latitude, longitude), search_radius)

        # Return the top restaurants as JSON response
        return jsonify({"restaurants": top_restaurants})
    return jsonify({"error": "Invalid location"})


def search_restaurants(location, radius):
    response = gmaps.places_nearby(location=location, radius=radius, type="restaurant")

    results = response["results"]
    sorted_results = sorted(results, key=lambda x: x.get("rating", 0), reverse=True)
    top_3_locations = sorted_results[:3]
    return top_3_locations


# CHATGPT
@app.route("/tripLocations", methods=["POST"])
def getTripLocations():
    data = request.get_json()

    desiredLocation = data["desiredLocation"]
    days = data["days"]
    activities = data["activities"]
    date = data["startDate"]

    locationResponse = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=generate_trip_locations(desiredLocation, activities),
    )
    locations = locationResponse["choices"][0]["message"]["content"]
    print(locations)
    return locations


@app.route("/tripAttractions", methods=["POST"])
def getTripAttractions():
    data = request.get_json()

    desiredLocation = data["desiredLocation"]
    days = data["days"]
    activities = data["activities"]
    date = data["startDate"]

    attractionsResponse = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=generate_trip_attractions(desiredLocation, days, activities, date),
    )
    attractions = attractionsResponse["choices"][0]["message"]["content"]
    print(attractions)
    return attractions


# HOW TO CALL THE PACKING LIST SHIT
# packingListResponse = openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     messages=generate_packingList_prompt(trip),
# )
# packingList = packingListResponse["choices"][0]["message"]["content"]


def generate_trip_locations(desiredLocation, activities):
    return [
        {
            "role": "system",
            "content": "You are a travel-planning list-maker. "
            + "Generate 10 travel destinations depending on user input. "
            + "For example: if the user likes Hawaii and swimming, suggest places like Cancun, Caribbeans, etc. "
            + "Example 2: if the user likes hiking, suggest places like the Canadian Rockies, Lake Tahoe, or Half Dome. "
            + "Format each different place on a new line. "
            + "Number each place 'ONE. ', 'TWO. ', 'THREE. ', 'FOUR. ', ..."
            + "Do not include anything besides the list. Again, do NOT include any extra information such as explanations. "
            + "Here is an example where the location is 'Hawaii' and the activities are 'snorkeling' and 'sun-bathing': "
            + "'ONE. Hawaii\n"
            + "TWO. Cancun\n"
            + "THREE. Philippines\n"
            + "FOUR. Bora Bora\n"
            + "FIVE. Galapagos Islands\n"
            + "SIX. Caribbeans\n"
            + "SEVEN. Fiji\n"
            + "EIGHT. Samoa\n"
            + "NINE. Dominican Republic\n"
            + "TEN. Barbados'"
            + "Notice how this model response ONLY included the list, and no explanations.",
        },
        {
            "role": "user",
            "content": "I am looking to go on a vacation in a place similar to "
            + desiredLocation,
        },
        {
            "role": "user",
            "content": "I would like to do these activities: " + ",".join(activities),
        },
    ]


def generate_trip_attractions(desiredLocation, days, activities, date):
    return [
        {
            "role": "system",
            "content": "You are a travel planning assistant. "
            + "Generate a list of popular attractions I can go to in "
            + desiredLocation
            + "."
            + "Format it with a header displaying the location. "
            + "For example, if the user is visiting Hawaii, the first line should be 'LOCATION: Hawaii' "
            + "Then, generate a list of popular attractions to visit each day, with 4 places for each day. "
            + "(for example, for a 3 day trip, generate 12 attractions and for a 10 day trip, generate 40 attractions.) "
            + "Format each list item on a new line, starting with 'ATTRACTION 1: ', 'ATTRACTION 2: ', etc. "
            + "Here is an example for days == 1 and a user inputted location of 'Hawaii': "
            + "LOCATION: Hawaii: \n"
            + "ATTRACTION 1: Hawaii Volcanoes National Park \n"
            + "ATTRACTION 2: Polynesian Cultural Center \n"
            + "ATTRACTION 3: Pearl Harbor \n"
            + "ATTRACTION 4: Waimea Canyon State Park \n",
        },
        {
            "role": "user",
            "content": "I am currently planning a vacation trip that will span "
            + days
            + " days and begins on "
            + date,
        },
        {
            "role": "user",
            "content": "I would like to do these activities: " + ",".join(activities),
        },
    ]


def generate_packingList_prompt(trip):
    return [
        {
            "role": "system",
            "content": "You are a travel planning assisnant. "
            + "Generate a comprehensive packing list for me based off my trip information."
            + "Format it into sections such as Clothing, Toiletries, Technology, and Miscellaneous"
            + "Also, number each section 'SECTION 1 - ', 'SECTION 2 - ', 'SECTION 3 - ' ..."
            + "For each section, generate a list of items to bring with the trip information in mind"
            + "Format each list item on a new line, starting with 'ITEM 1: ', 'ITEM 2: ', etc. "
            + "Here is an example of a Clothing section"
            + "SECTION 1 - Clothing \n"
            + "ITEM 1: Light and comfortable clothes for beach destinations, including shorts, t-shirts, tank tops, and sundresses/skirts\n"
            + "ITEM 2: Swimsuits (at least 2 per destination) \n"
            + "ITEM 3: Rash guard shirt for surfing and snorkeling \n",
        },
        {
            "role": "user",
            "content": "This is the itenerary for my trip:" + trip,
        },
    ]


if __name__ == "__main__":
    app.run(debug=True, port=5002)
