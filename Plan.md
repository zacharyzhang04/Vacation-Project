Project Plan - Itinerary Planner

Overview
The Itinerary Planner is a web application that allows users to create personalized travel itineraries based on their preferences. The application integrates with various APIs to fetch hotel information, location data, and utilize OpenAI's chatGPT for travel destination recommendations. The project is divided into three main components: frontend, backend, and database.



1. Frontend
The frontend of the application will be developed using React, a popular JavaScript library for building user interfaces. The frontend will provide an intuitive and user-friendly interface for users to interact with the application.
The frontend directory structure will include the following files and folders:

src: Contains the source code of the frontend application.
components: Includes reusable components such as forms, buttons, and navigation.
pages: Contains individual pages/screens of the application, including login, home, itinerary creation, and result pages.
api.js: Handles API calls to the backend server.
App.js: The main component that sets up the application's routes and navigation.
index.js: Renders the main application component and mounts it to the HTML document.



2. Backend
The backend of the application will be implemented using Flask, a lightweight Python web framework. It will handle the business logic, API integration, and communication with the database.
The backend directory structure will include the following files and folders:

app.py: The main Flask application file that sets up routes and handles requests.
database.py: Manages the database connections and operations.
helpers.py: Contains helper functions for API calls, data manipulation, and authentication.
models.py: Defines the database models and schema.
config.py: Stores configuration variables such as API keys and database connection details.
requirements.txt: Lists the required Python packages and their versions.



3. Database
For storing user profiles, itineraries, and related information, a MySQL database will be utilized. MySQL provides a reliable and scalable database solution for this project.
The database structure will include the following tables:

users: Stores user information such as name, email, phone number, and authentication details.
itineraries: Contains the details of each itinerary, including the user ID, itinerary name, destination, date, and status (past, present, or future).



API Integration
The application will integrate with the following APIs:

Amadeus API: To fetch hotel information based on user preferences and locations.
Google Maps API: For retrieving location data, searching for nearby places, and finding the closest grocery stores.
OpenAI's chatGPT API: Utilized to provide travel destination recommendations and generate hourly schedules for itineraries.
To use these APIs, you need to sign up for the respective API services, obtain API keys, and store them securely in the backend's config.py file.

