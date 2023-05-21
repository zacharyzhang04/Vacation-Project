import React,  { useState } from 'react';
import HomePage from './pages/Home';
import DestinationPage from './pages/DestinationPage';
import ResultPage from './pages/ResultPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NavBar from './components/navbar'


function App() {
  const [currentPage, setCurrentPage] = useState('home');


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'destinations':
        return <DestinationPage />;
      case 'result':
        return <ResultPage />;
      case 'login':
        return <LoginPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage />;
    }
  };


  return (
    <div className="App">
      <NavBar handlePageChange={handlePageChange} />
      {renderPage()}
    </div>
  );
}

export default App;
