import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, redirect, render_template, url_for
from flask_cors import CORS

# APIs
import openai
import googlemaps
import requests
from geopy.geocoders import Nominatim
from googleapiclient.discovery import build


app = Flask(__name__)
CORS(app)
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
gmaps_api_key = os.getenv("GMAPS_API_KEY")
google_general_api_key = os.getenv("GOOGLE_API_KEY")
google_search_engine_ID = os.getenv("GOOGLE_SEARCH_ID")
unsplash_access_key = os.getenv("UNSPLASH_API_KEY")
gmaps = googlemaps.Client(gmaps_api_key)

service = build("customsearch", "v1", developerKey=google_general_api_key)


# GOOGLE CUSTOM SEARCH
def search_location_images(query):
    response = (
        service.cse()
        .list(
            cx=google_search_engine_ID,
            q=query,
            searchType="image",
            num=1,  # Number of images to retrieve
        )
        .execute()
    )
    images = response.get("items", [])
    if images:
        image_data = images[0]["image"]
        attribution = image_data.get("contextLink", "")
        image_url = images[0]["link"]
        return image_url, attribution
    else:
        return None, None


# UNSPLASH
@app.route("/generate_image")
def generate_image():
    location_name = request.args.get("location")

    url = f"https://api.unsplash.com/photos/random?query={location_name}&client_id={unsplash_access_key}"
    response = requests.get(url)
    data = response.json()

    if "urls" in data and "user" in data:
        image_url = data["urls"]["regular"]
        image_author = data["user"]["name"]
        return jsonify(image_url, image_author)
    else:
        return "Image not found"


# GMAPS
def get_place_id_from_location(latitude, longitude):
    result = gmaps.reverse_geocode(latlng=(latitude, longitude))

    if result:
        for component in result[0]["address_components"]:
            if "place_id" in component:
                place_id = component["place_id"]
                return place_id

    return None


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
    activities = data["activities"]

    locationResponse = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=generate_trip_locations(desiredLocation, activities),
    )
    locations = locationResponse["choices"][0]["message"]["content"]

    lines = locations.strip().split("\n")
    print(lines)

    locationDict = {}
    for line in lines:
        colon_index = line.find(":")
        if colon_index == -1 or colon_index == len(line) - 1:
            continue
        nextLocation = line[colon_index + 2 :]

        hyphen_index = nextLocation.find("-")
        if hyphen_index == -1 or hyphen_index == len(line) - 1:
            continue
        justLocation, locationDescription = (
            nextLocation[: hyphen_index - 1],
            nextLocation[hyphen_index + 2 :],
        )
        locationDict[justLocation] = {"description": locationDescription}

    # Get the latitude and longitude of locations
    for location in locationDict:
        geolocator = Nominatim(user_agent="my-app")
        location_data = geolocator.geocode(location)

        if location_data:
            locationDict[location]["latitude"] = location_data.latitude
            locationDict[location]["longitude"] = location_data.longitude

    # Get the url of a picture of the location
    for location in locationDict:
        locationLink, locationSource = search_location_images(location)
        locationDict[location]["picture"] = locationLink
        locationDict[location]["pictureSource"] = locationSource

    print(len(locationDict))
    return locationDict


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
            + "Generate 8 travel destinations depending on user input. "
            + "For example: if the user likes Hawaii and swimming, suggest places like Cancun, Caribbeans, etc. "
            + "Example 2: if the user likes hiking, suggest places like the Canadian Rockies, Lake Tahoe, or Half Dome. "
            + "Format each different place on a new line. "
            + "Number each place 'ONE: ', 'TWO: ', 'THREE: ', 'FOUR: ', ..."
            + "After the name of the location add a hyphen and then a discription of the location "
            + "Here is an example where the location is 'Hawaii' and the activities are 'snorkeling' and 'sun-bathing': "
            + "'ONE: Hawaii - World-class beaches, pristine rainforests, and sizzling volcanoes are just a few things that make Hawaii a happening hotspot for tourists. Every Hawaiian Island has its own draw, making this state one that is filled with adventure and luxury no matter which way you turn.\n"
            + "TWO: Cancun - Cancun is a paradise for nature lovers and adventure seekers since there are plenty of things to do. Dive or snorkel in the region’s mystic cenotes located nearby (limestone sinkholes), or enjoy the day by the beach, jet skiing or parasailing.\n"
            + "THREE: Philippines\n"
            + "FOUR: Bora Bora\n"
            + "FIVE: Galapagos Islands\n"
            + "SIX: Caribbeans\n"
            + "SEVEN: Fiji\n"
            + "EIGHT: Samoa"
            + "Notice how Hawaii and Cancun had discriptions, this is the ideal format. Please do no generate any additional text other than what was asked for",
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
