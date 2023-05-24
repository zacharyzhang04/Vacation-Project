import React, {useState} from 'react';
import {auth, db} from "../config/firebase.js"
import {signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, onSnapshot } from "firebase/firestore";

const LoginPage = ({ userData, setUserData, handlePageChange}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");

      
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in and change current user data
      const {user} = await signInWithEmailAndPassword(auth, email, password);
      onSnapshot((doc(collection(db, "users"), user.uid)), (snapshot) => {
        if (snapshot.exists) {
          setUserData(snapshot.data());
          console.log(userData);
          handlePageChange('home');
        } else {
          console.log('Document does not exist.');
        }
      });
    } catch (err) {
      console.log(err);
    }

    // set all data to null
    console.log(auth?.currentUser?.email);
    setEmail("");
    setName("");
    setPassword("");
    setAge(0);
    setGender("");
  };
  
  return (
    <div className='container'>
      <h1 className="title">Login</h1>
      <form onSubmit={handleLogin}>
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

      <div>
        Don't have an account?
        <button className="submit-button" onClick={() => handlePageChange('signup')}> Sign Up</button>
      </div>
      
    </div>
  );
};

export default LoginPage;