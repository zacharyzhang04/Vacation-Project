import React from 'react';

function HomePage({userData}) {
  console.log(userData && userData.FullName);
  if (!userData) {
    return (
      <div>
        <h1>Welcome to My Travel Planner!</h1>
        <p>Start planning your dream vacation with ease.</p>
        Sign in to view sum deets about yo self bruv. my name a borat i like you i like s--
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome to My Travel Planner!</h1>
      <p>Start planning your dream vacation with ease.</p>
      WELCOME {userData && userData.FullName}!
      <p>Email: {userData && userData.Email}</p>
      <p>Age: {userData && userData.Age}</p>
      <p>Gender: {userData && userData.Gender}</p>
      <p>Id: {userData && userData.UserId}</p>
    </div>
  );
}

export default HomePage;