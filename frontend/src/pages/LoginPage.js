import React, {useState} from 'react';
import {auth} from "../firebase.js"
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
    console.log(auth?.currentUser?.email);
  };

  const handleSignUp = async (e) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
    console.log(auth?.currentUser?.email);
  }

  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default LoginPage;