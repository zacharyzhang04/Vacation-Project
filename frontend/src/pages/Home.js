import React from 'react';

function HomePage({userData}) {
  console.log(userData && userData.FullName);
  if (!userData) {
    return (
      <div className='container'>
        <h1>Welcome to My Travel Planner!</h1>
        <h3>Start planning your dream vacation with ease.</h3>
        Sign in to begin
      </div>
    );
  }
  return (
    <div className='container'>
      <h1>Welcome to My Travel Planner!</h1>
      <h3>Start planning your dream vacation with ease.</h3>
      WELCOME {userData && userData.FullName}!
      {/* <p>Email: {userData && userData.Email}</p>
      <p>Age: {userData && userData.Age}</p>
      <p>Gender: {userData && userData.Gender}</p>
      <p>Id: {userData && userData.UserId}</p>*/}
      
    </div>
  );
}

export default HomePage;