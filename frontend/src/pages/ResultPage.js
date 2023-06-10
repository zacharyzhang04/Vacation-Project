import React, {useState, useEffect} from 'react';
import { db} from "../config/firebase.js"
import { collection, addDoc } from "firebase/firestore";

const ResultPage = ({response, userData, tripData, setTripData, tripInput, handlePageChange}) => {
  const [loading, setLoading] = useState(true);
  const [itin, setItin] = useState("")

  useEffect(() => {
    console.log(tripInput);
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5002/tripAttractions', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(tripInput)
        });

        if (response.ok) {
          const data = await response.json();
          setItin(data["itinerary"]);
          console.log(itin);
          
          setLoading(false);
        } else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);

  

  const processResponse = () => {
    let currentTripData = tripData;
    currentTripData["UserId"] = userData.UserId;
    currentTripData["itinerary"] = itin;
    setTripData(currentTripData);
  }

  const addItinerary = async () => {
    processResponse();
    try {
      const tripsRef = collection(db, "trips");
      await addDoc(tripsRef, tripData);
      console.log("Trip created successfully!");
      handlePageChange("profile");
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };
  
  
  if (loading) {
    return <div className='container'>
      <h1>Loading...</h1>
      </div>
  }
  return (
    <div className='container'>
      <div class="overlay"> ITINERARY </div>
      <div className='itinerary' style={{ fontSize: '10px', fontWeight: 'bold' }}>
          {itin.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
      </div>
      <button type="submit" class="submit-button" onClick={addItinerary}>Submit</button>
    </div>
  )
};

export default ResultPage;