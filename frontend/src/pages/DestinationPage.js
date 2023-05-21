import React, {useState} from 'react';
import { db} from "../config/firebase.js"
import { collection, addDoc } from "firebase/firestore";

const DestinationPage = () => {
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState("");
 

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

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  
  const addActivity = () => {
    if (activity.trim() !== '') {
      const newActivities = [...activities]; // Create a copy of the activities array
      newActivities.push(activity); // Add the new activity to the copy
      setActivities(newActivities); // Update the state with the new array
      setActivity(''); // Clear the input field after adding an activity
    }
  };

  const planTrip = () => {
    console.log("not implemented yet");
    /* make request to backend to get openAI API data. then use that data to load next page. slay
     */
  };

  return (
    <div>
      <h1>Plan your next trip!</h1>
      where u live bro?
      <input type="text" value={location} onChange={handleLocationChange} />
      what activity u like to do?
      <input type="text" value={activity} onChange={handleChange} />
      <button onClick={addActivity}>Add Activity</button>

      <div> u said that u live in {location}</div>
      <div>
        <h2>List of Activities</h2>
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>


      <button onClick={planTrip}> SUBMIT INFO</button>
    </div>
  );
};

export default DestinationPage;