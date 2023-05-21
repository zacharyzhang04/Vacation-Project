import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDRiu4_X3bWyywEvLWPDFXjxqvALkScJFg",
    authDomain: "travel-itinerary-db-247fc.firebaseapp.com",
    projectId: "travel-itinerary-db",
    storageBucket: "travel-itinerary-db.appspot.com",
    messagingSenderId: "874529483743",
    appId: "1:874529483743:web:f68ba0682dd159cb2ab26a",
    measurementId: "G-7BZDKZ2HW4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

