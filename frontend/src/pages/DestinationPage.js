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
    <div className='container'>
      <h1>Almost There...</h1>
      
      <h3> We'll need to ask some questions to choose the perfect vacation destination!</h3>
    

      <p> Enter your desired vacation location (optional) </p> 
      <input className="textbox" type="text" value={location} onChange={handleLocationChange} />
  

      <p>Enter your favorite vacation activities</p>
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