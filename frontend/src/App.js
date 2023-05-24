import React,  { useState } from 'react';
import HomePage from './pages/Home';
import DestinationPage from './pages/DestinationPage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NavBar from './components/navbar';
import SignUpPage from './pages/SignUpPage';
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        console.log(userData);
        return <HomePage userData={userData} />;
      case 'destinations':
        return <DestinationPage />;
      case 'result':
        return <ResultPage />;
      case 'login':
        return <LoginPage userData={userData} setUserData={setUserData} handlePageChange={handlePageChange}/>
      case 'profile':
        return <ProfilePage userData={userData}/>
      case 'signup':
        return <SignUpPage userData={userData} setUserData={setUserData} handlePageChange={handlePageChange}/>
      default:
        return <HomePage />;
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
