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
    <div className='container'>
      <h1>My Trips</h1>
      {itineraryList.map((i) => (
        <div key={i}>
          <h1> {i && i.Location} Itinerary  </h1>
          <h3>START AND END DATES</h3> <p>{i && i.Start.toDate().toString()}</p>
          <p> {i && i.End.toDate().toString()}</p>
          <h3> ITINERARY</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {i &&
              i.Itinerary.split(".").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
          <h3> PACKING LIST</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {i &&
              i.PackingList.split(",").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
          
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;