import React from 'react';

const LoadingPage = ({tripInput, response, setResponse, handlePageChange}) => {
  const getResponse = async () => {
    await fetch('http://localhost:5002/openai', {
        method: 'POST',
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(tripInput)
      })
      .then( response => response.text())
      .then(data => setResponse(data))
      .catch(error => console.error(error));
  
      console.log(response);
      handlePageChange('choose');
  }
  getResponse();
  return (
    <div className='container'>
      <div>
        <h1> Loading...</h1>
      </div>
    </div>
  );
};

export default LoadingPage;