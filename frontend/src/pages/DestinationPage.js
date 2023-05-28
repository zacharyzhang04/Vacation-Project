import React, {useState} from 'react';
import { db} from "../config/firebase.js"
import { collection, addDoc } from "firebase/firestore";

// We def got to rename variables when we done. 
const DestinationPage = ({response, setResponse, handlePageChange}) => {
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [days, setDays] = useState("");
  const [start, setStart] = useState("");
   
 

  // THIS IS FOR LATER, FOR WHEN WE CREATE THE ACTUAL ITINERARY
  /*
  const [itineraryData, setItineraryData] = useState({});

  const createItinerary = async () => {
    try {
      const itinerariesRef = collection(db, "itineraries");
      await addDoc(itinerariesRef, itineraryData);
      console.log("Itinerary created successfully!");
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };*/


  const handleChange = (e) => {
    setActivity(e.target.value);
  };

  const handleCurrentLocationChange = (e) => {
    setCurrentLocation(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDaysChange = (e) => {
    setDays(e.target.value);
  };

  const handleStartChange = (e) => {
    setStart(e.target.value);
  }
  
  const addActivity = () => {
    if (activity.trim() !== '') {
      const newActivities = [...activities]; // Create a copy of the activities array
      newActivities.push(activity); // Add the new activity to the copy
      setActivities(newActivities); // Update the state with the new array
      setActivity(''); // Clear the input field after adding an activity
    }
  };

  const planTrip = async () => {
    /* make request to backend to get openAI API data. then use that data to load next page. slay
     */

    const params = {
      "desiredLocation" : location,
      "currentLocation": currentLocation,
      "days": days,
      "activities": activities,
      "startDate": start
    }

    await fetch('http://localhost:5002/openai', {
      method: 'POST',
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(params)
    })
    .then( response => response.text())
    .then(data => setResponse(data))
    .catch(error => console.error(error));

    console.log(response);
    handlePageChange('result');
  };

  return (
    <div className='container'>
      <h1>Almost There...</h1>
      
      <h3> We'll need to ask some questions to choose the perfect vacation destination!</h3>

      <p> Enter your current location: (optional) </p> 
      <input name="current_location" 
      className="textbox" type="text" value={currentLocation} onChange={handleCurrentLocationChange} />

      <p> Enter an example of your desired vacation location: (optional) </p> 
      <input name="desired_location" 
      className="textbox" type="text" value={location} onChange={handleLocationChange} />

      <p> Enter your desired vacation length in days: </p> 
      <input name="vacation_length"
      className="textbox" type="text" value={days} onChange={handleDaysChange} />

      <p> Enter the start date of your trip ("May 69th, 2023"): </p> 
      <input name="start_date"
      className="textbox" type="text" value={start} onChange={handleStartChange} />
  
  

      <p>Enter your favorite vacation activities: </p>
      <input className="textbox" type="text" value={activity} onChange={handleChange} />
      <br></br>
      <button className="submit-button" onClick={addActivity}>Add Activity</button>



      <div>
        <h2>List of Activities</h2>
        <ul>
          {activities.map((activity, index) => (
            <div key={index}>{activity}</div>
          ))}
        </ul>
      </div>


      <button className="submit-button" onClick={planTrip}> PLAN MY TRIP</button>
    </div>
  );
};

export default DestinationPage;