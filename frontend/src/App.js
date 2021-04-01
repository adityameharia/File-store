import './App.css';
import React from 'react';
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

  

  return (
    <Router>
      <Switch>
        <Route path="/login">
        {!auth.currentUser ? <Login/>:<Redirect to="/" />}     
          
        </Route>
        <Route path="/signup">
        {!auth.currentUser ? <SignUp/>:<Redirect to="/" />}       
        </Route>
        <Route path="/forgotpassword">
        {!auth.currentUser ? <ForgotPassword/>:<Redirect to="/" />}       
        </Route>
        <Route path="/">
          <File/>
        </Route>
      </Switch >
    </Router>
  );
}

export default App;
