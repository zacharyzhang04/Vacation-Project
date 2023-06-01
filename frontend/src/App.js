import React,  { useState, useEffect } from 'react';
import HomePage from './pages/Home';
import DestinationPage from './pages/DestinationPage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NavBar from './components/navbar';
import SignUpPage from './pages/SignUpPage';
import "./App.css";
import ChooseDestination from './pages/ChooseDestination';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  const [response, setResponse] = useState('');
  const [tripInput, setTripInput] = useState({});
  const [tripData, setTripData] = useState({});

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'choose':
        return <ChooseDestination tripInput={tripInput}
                                  setTripInput={setTripInput}
                                  response={response}
                                  handlePageChange={handlePageChange}/>
      case 'destinations':
        return <DestinationPage setTripInput={setTripInput} 
                                setTripData={setTripData} 
                                response={response}
                                handlePageChange={handlePageChange}
                                setResponse={setResponse} />;
      case 'result':
        return <ResultPage response={response}
                            userData={userData}
                            tripData={tripData} setTripData={setTripData} />;
      case 'login':
        return <LoginPage userData={userData} setUserData={setUserData} 
                          handlePageChange={handlePageChange}/>
      case 'profile':
        return <ProfilePage userData={userData}/>
      case 'signup':
        return <SignUpPage userData={userData} setUserData={setUserData} 
                          handlePageChange={handlePageChange}/>
      default:
        return <HomePage userData={userData}/>;
    }
  };


  return (
    <div className="App">
      <NavBar userData={userData} handlePageChange={handlePageChange} setUserData={setUserData} />
      {renderPage()}
    </div>
  );
}

export default App;
