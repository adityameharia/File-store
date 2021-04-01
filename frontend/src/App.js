import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LoginHooks from './components/Login';
import File from './components/File';
import 'react-toastify/dist/ReactToastify.css';
import {auth} from './utils/firebase'



function App() {

  console.log(auth.currentUser)

  return (
    <Router>
      <Switch>
        <Route path="/login">
        {auth.currentUser ? <LoginHooks/>:<Redirect to="/" />}       
        </Route>
        <Route path="/">
          <File/>
        </Route>
      </Switch >
    </Router>
  );
}

export default App;
