import './App.css';
import React,{useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './components/Login'
import File from './components/File';
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import 'react-toastify/dist/ReactToastify.css';
import {auth} from './utils/firebase'



function App() {

  let [isLoggedIn,setIsLoggedIn]=useState(true)

  auth.onAuthStateChanged(function(user){
    if (user == null) {
      setIsLoggedIn(false)
    }else{
      setIsLoggedIn(true)
    }

  })

  return (
    <Router>
      <Switch>
        <Route path="/login">
        {/* {!isLoggedIn ? <Login/>:<Redirect to="/" />}      */}
          <Login/>
        </Route>
        <Route path="/signup">
        { !isLoggedIn ? <SignUp/>:<Redirect to="/" />}       
        </Route>
        <Route path="/forgotpassword">
        { !isLoggedIn? <ForgotPassword/>:<Redirect to="/" />}       
        </Route>
        <Route path="/">
          <File/>
        </Route>
      </Switch >
    </Router>
  );
}

export default App;
