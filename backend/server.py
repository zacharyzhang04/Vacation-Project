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
@app.route('/api/restaurants', methods=["POST"])
def get_top_restaurants():
    location = request.args.get('location')

    # Get the latitude and longitude of the location
    geolocator = Nominatim(user_agent='my-app')
    location_data = geolocator.geocode(location)

    if location_data:
        latitude, longitude = location_data.latitude, location_data.longitude
        search_radius = 5000

        # Perform the nearby search for restaurants and get the top 3 locations
        top_restaurants = search_restaurants((latitude, longitude), search_radius)

        # Return the top restaurants as JSON response
        return jsonify({'restaurants': top_restaurants})
    return jsonify({'error': 'Invalid location'})


def search_restaurants(location, radius):
    response = gmaps.places_nearby(
        location=location,
        radius=radius,
        type='restaurant'
    )

    results = response['results']
    sorted_results = sorted(results, key=lambda x: x.get('rating', 0), reverse=True)
    top_3_locations = sorted_results[:3]
    return top_3_locations

# CHATGPT
@app.route("/openai", methods=["POST"])
def openai_endpoint():
    
    data = request.get_json()

    currentLocation = data["currentLocation"]
    desiredLocation = data["desiredLocation"]
    days = data["days"]
    activities = data["activities"]
    date = data["startDate"]

    tripResponse = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=generate_trip_locations(desiredLocation, activities),
    )
    trip = tripResponse["choices"][0]["message"]["content"]
    print(trip)
    return trip
    
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
            + "Notice how this model response ONLY included the list, and no explanations."
        },
        {
            "role": "user",
            "content": "I am looking to go on a vacation in a place similar to " + desiredLocation
        },
        {
            "role": "user",
            "content": "I would like to do these activities: " + ",".join(activities)
        }
    ]

def generate_trip_prompt(currentLocation, desiredLocation, days, activities, date):
    return [
        {
            "role": "system",
            "content": "You are a travel planning assistant. "
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
            + "DAY 3: Bacalar Lake",
        },
        {
            "role": "user",
            "content": "I live at "
            + currentLocation
            + " and I am currently planning a vacation trip that will span "
            + days
            + " days and begins on "
            + date,
        },
        {
            "role": "user",
            "content": "An example of a location I would like to visit is "
            + desiredLocation,
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
