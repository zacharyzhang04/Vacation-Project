import React from 'react';
import {auth} from "../config/firebase.js"
import {signOut} from 'firebase/auth';

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

  return (
    <nav>
      <ul>
        <li>
          <button onClick={() => handlePageChange('home')}>Home</button>
        </li>
        <li>
          <button onClick={logOut}>Log Out</button>
        </li>
        <li>
          <button onClick={() => handlePageChange('login')}>Log In</button>
        </li>
        <li>
          <button onClick={() => handlePageChange('destinations')}>Plan New Trip</button>
        </li>
        <li>
          <button onClick={() => {if (userData) handlePageChange('profile')}}>My Trips</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;