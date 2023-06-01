import React, {useState} from 'react';
import { db} from "../config/firebase.js"
import { collection, addDoc } from "firebase/firestore";

const ResultPage = ({response, userData, tripData, setTripData}) => {
  /*const processResponse = () => {
    let currentTripData = tripData;
    currentTripData["UserId"] = userData.UserId;
    setTripData(currentTripData);
  }

  const createTrip = async () => {
    processResponse();
    try {
      const tripsRef = collection(db, "trips");
      await addDoc(tripsRef, tripData);
      console.log("Trip created successfully!");
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };
  return (
    <div className='container'>
      <div>
        <h1 className='white_h1'>Result Page</h1>
        <p className='response'>{response}</p>
        <button className="submit-button" onClick={createTrip}> Save Trip</button>
      </div>
    </div>
  );*/
  return (
    <div>
      HELLO BITCHASS HOE
    </div>
  )
};

export default ResultPage;