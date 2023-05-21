import React from 'react';
import {auth} from "../firebase.js"
import {signOut} from 'firebase/auth';

const Navbar = ({ handlePageChange }) => {
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
    handlePageChange('login');
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
          <button onClick={() => handlePageChange('destinations')}>Plan New Trip</button>
        </li>
        <li>
          <button onClick={() => handlePageChange('profile')}>My Trips</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;