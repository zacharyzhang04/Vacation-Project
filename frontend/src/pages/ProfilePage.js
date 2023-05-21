import React, {useEffect, useState} from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js"

// SHOULD ACTUALLY BE NAMED MY TRIP PAGE

const ProfilePage = ({userData}) => {
  const [itineraryList, setItineraryList] = useState([]);
  const [idList, setIdList] = useState([]);
  
  const currentUser = userData.UserId;
  
  

  console.log(currentUser);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const newItineraries = [];
        const newIds = [];

        const itinerariesRef = collection(db, "itineraries");
        const q = query(itinerariesRef, where("UserId", "==", currentUser));
        const qSnapshot = await getDocs(q);
        qSnapshot.forEach((doc) => {

          const newItinerary = doc.data();
          console.log(doc.id);
          console.log(newItinerary);
          const ID = doc.id;
          
          const isDuplicate = idList.some((id) => { return (id === ID)});
          if (!isDuplicate) {
            newItineraries.push(newItinerary);
            newIds.push(ID);
          }
        });

        setItineraryList(newItineraries);
        setIdList(newIds);
        
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchItineraries();
  }, []);


  
  return (
    <div>
      <h1>My Trips</h1>
      {itineraryList.map((i) => (
        <div key={i}>
          <p>Owner: {i && i.OwnerName}</p>
          <p>Start: {i && i.Start.toDate().toString()}</p>
          <p>End: {i && i.End.toDate().toString()}</p>
          <p>Location: {i && i.Location}</p>
          <p>Schedule: {i && i.Itinerary}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;