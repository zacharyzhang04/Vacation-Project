import React, {useState} from 'react';
import {auth, db, googleProvider} from "../config/firebase.js"
import {GoogleAuthProvider, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import { collection, doc, onSnapshot } from "firebase/firestore";
import GoogleButton from 'react-google-button'

const LoginPage = ({ userData, setUserData, handlePageChange}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  const signInUser = (user) => {
    onSnapshot((doc(collection(db, "users"), user.uid)), (snapshot) => {
      if (snapshot.exists) {
        setUserData(snapshot.data());
        console.log(userData);
        handlePageChange('home');
      } else {
        console.log('Document does not exist.');
      }
    });

    // set all data to null
    console.log(auth?.currentUser?.email);
    setEmail("");
    setPassword("");
  }

  const defaultLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in and change current user data
      const {user} = await signInWithEmailAndPassword(auth, email, password);
      signInUser(user);
    } catch (err) {
      console.log(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const {user} = await signInWithPopup(auth, googleProvider);
      signInUser(user);
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className='container'>
      <h1 className="title">Login</h1>
      <form onSubmit={defaultLogin}>
        <input className='login-button'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <input className='login-button'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br>
        <button className="submit-button" type="submit">Log In</button>
      </form>
      <div id="googleButton">
        <GoogleButton onClick={signInWithGoogle}/>
      </div>
      <div>
        Don't have an account?
        <button className="submit-button" onClick={() => handlePageChange('signup')}> Sign Up</button>
      </div>
      
    </div>
  );
};

export default LoginPage;