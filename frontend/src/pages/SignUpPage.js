import React, {useState} from 'react';
import {auth, db} from "../config/firebase.js"
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import {signOut} from 'firebase/auth';


const SignUpPage = ({ userData, setUserData, handlePageChange}) => {
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a new user document in Firestore
      const userDocRef = doc(collection(db, "users"), user.uid);
      await setDoc(userDocRef, {
        UserId: user.uid,
        FullName: name,
        Email: user.email,
        Gender: gender,
        Age: age
      });

      // reuse Login logic
      await signOut(auth);
      await handleLogin(e);
      console.log("User signed up successfully!");
      handlePageChange('home');
    } catch (err) {
      console.log(err);
    }
  }

  
  return (
    <div>
      <h1 className="title">Sign Up</h1>

      <p>
        Enter your personal information. Your password must be at least 6 characters.
      </p>
      <form onSubmit={handleSignUp}>
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
        <input className='login-button'
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br></br>
        <input className='login-button'
          type="text"
          placeholder="Gender(s)"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <br></br>
        <input className='login-button'
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <br></br>
        <button className="submit-button" onClick={handleSignUp}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;