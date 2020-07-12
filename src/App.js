import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);


function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
const [user, setUser] = useState({
  isSignedIn: false,
  name: '',
  email: '',
  photo: ''
});



  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      const {displayName, email, photoURL} = result.user

      const signIn ={
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signIn);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
}
const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res =>{
      const signOut = {
        isSignedIn: false,
        name: "",
        email: '',
        photo: '',
        password: '',
        error: '',
        isValid: false,
        existingUser: false
      }
      setUser(signOut);
    })
    .catch(err =>{

    })
}
const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
const hasNumber = input => /\d/.test(input);

const switchForm = e =>{
  const createdUser = {...user};
  createdUser.existingUser = e.target.checked;
  setUser(createdUser);
}

const handleChange = e =>{
  const newUserInfo ={
    ...user
  };

  let isValid = true;
  if(e.target.name === 'email'){
    isValid = is_valid_email(e.target.value);
  }
  if(e.target.name === "password"){
    isValid = e.target.value.length > 8 && hasNumber(e.target.value);
  }

  newUserInfo[e.target.name] = e.target.value;
  newUserInfo.isValid = isValid;
  setUser(newUserInfo);
}



const createAccount = (event) =>{
  if(user.isValid){
    
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(ress =>{
      console.log(ress);
      const createdUser = {...user};
      createdUser.isSignedIn = true;
      createdUser.error = '';
      setUser(createdUser);
    })
    .catch(err =>{
      console.log(err.message); 
      const createdUser = {...user};
      createdUser.isSignedIn = false;
      createdUser.error = err.message;    
      setUser(createdUser);
    })
  }
  
  event.preventDefault(); //peramiter this line will break default reload.
  event.target.reset();
}
 
const signInUser = event => {
  if(user.isValid){
    
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(ress =>{
      console.log(ress);
      const createdUser = {...user};
      createdUser.isSignedIn = true;
      createdUser.error = '';
      setUser(createdUser);
    })
    .catch(err =>{
      console.log(err.message); 
      const createdUser = {...user};
      createdUser.isSignedIn = false;
      createdUser.error = err.message;    
      setUser(createdUser);
    })
  }
  event.preventDefault();
  event.target.reset();
}

  return (
    <div className="sign-in">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>:
        <button onClick={handleSignIn}>Sign in</button>
      }
      {
      user.isSignedIn && <div><h3>Welcome, {user.name}</h3>
      <h4>Your email: {user.email}</h4>
      <img src={user.photo} alt=""/></div>
      }
      <h1>Our own Authentication</h1>

      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="">Returnign User </label>

      <form style={{display: user.existingUser ? 'block':'none'}} onSubmit={signInUser}>
      <input type = "text" onBlur={handleChange} name="email" placeholder="your email" required/>
      <br/>
      <input type = "password" onBlur={handleChange} name="password" placeholder="your Password" required/> 
      <br/>
      <input type="submit" value="SignIn"/>
      </form>

      <form style={{display: user.existingUser ? 'none':'block'}} onSubmit={createAccount}>
      <input type = "text" onBlur={handleChange} name="name" placeholder="your name" required/> 
      <br/>
      <input type = "text" onBlur={handleChange} name="email" placeholder="your email" required/>
      <br/>
      <input type = "password" onBlur={handleChange} name="password" placeholder="your Password" required/> 
      <br/>
      <input type="submit" value="create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
