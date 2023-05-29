import React, {useEffect, useState} from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js"

// SHOULD ACTUALLY BE NAMED MY TRIP PAGE

const ProfilePage = ({userData}) => {
  const [tripList, setTripList] = useState([]);
  const [idList, setIdList] = useState([]);
  
  const currentUser = userData.UserId;
  
  

  console.log(currentUser);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const newTrips = [];
        const newIds = [];

        const tripsRef = collection(db, "trips");
        const q = query(tripsRef, where("UserId", "==", currentUser));
        const qSnapshot = await getDocs(q);
        qSnapshot.forEach((doc) => {

          const newTrip = doc.data();
          console.log(doc.id);
          console.log(newTrip);
          const ID = doc.id;
          
          const isDuplicate = idList.some((id) => { return (id === ID)});
          if (!isDuplicate) {
            newTrips.push(newTrip);
            newIds.push(ID);
          }
        });

        setTripList(newTrips);
        setIdList(newIds);
        
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchTrips();
  }, []);


  
  return (
    <div className='container'>
      <h1>My Trips</h1>
      {tripList.map((trip) => (
        <div key={trip}>
          <h1> {trip && trip.desiredLocation} Trip </h1>
          <h3>START AND END DATES</h3> <p>{trip && trip.startDate}</p>
          {/* <p> {trip && trip.End.toDate().toString()}</p> */}
          <h3> ITINERARY</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {trip &&
              trip.itinerary.split(".").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
          <h3> PACKING LIST</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {trip &&
              trip.packingList.split(",").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
          
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;