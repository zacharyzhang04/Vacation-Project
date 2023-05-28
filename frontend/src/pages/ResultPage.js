import React from 'react';

const saveTrip = () => {
  
}

const ResultPage = ({response}) => {
  return (
    <div className='container'>
      <div>
        <h1 className='white_h1'>Result Page</h1>
        <p className='response'>{response}</p>
        <button className="submit-button" onClick={saveTrip}> Save Trip</button>
      </div>
    </div>
  );
};

export default ResultPage;