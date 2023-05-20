

import React,  { useState } from 'react';
import HomePage from './pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      /*case 'destination':
        return <DestinationPage />;
      case 'result':
        return <ResultPage />;
      default:
        return <HomePage />;*/
    }
  };


  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
