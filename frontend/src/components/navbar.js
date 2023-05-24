import React from 'react';
import {auth} from "../config/firebase.js"
import {signOut} from 'firebase/auth';
import './navbar.css';

const Navbar = ({ userData, handlePageChange, setUserData }) => {
  const logOut = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (err) {
      console.log(err);
    }
    handlePageChange('home');
    console.log("DONE");
  }

  const handleDestinations = () => {
    if (userData != null) {
      handlePageChange('destinations');
    } else {
      handlePageChange('login');
    }
  }

  const handleTrips = () => {
    if (userData != null) {
      handlePageChange('profile');
    } else {
      handlePageChange('login');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-buttons">
        <button className="navbar-button" onClick={() => handlePageChange('home')}>Home</button>
        <button className="navbar-button" onClick={handleDestinations}>Plan New Trip</button>
        <button className="navbar-button" onClick={handleTrips}>My Trips</button>
        <button className="navbar-button" onClick={logOut}>Log Out</button>
        <button className="navbar-button" onClick={() => handlePageChange('login')}>Log In</button>
      </div>
      
    </nav>
  );
};

export default Navbar;