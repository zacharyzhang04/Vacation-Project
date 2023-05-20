import React from 'react';

const Navbar = ({ handlePageChange }) => {
  return (
    <nav>
      <ul>
        <li>
          <button onClick={() => handlePageChange('home')}>Home</button>
        </li>
        <li>
          <button onClick={() => handlePageChange('login')}>Log Out</button>
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