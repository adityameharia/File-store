import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/Login'
import File from './components/File';
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import 'react-toastify/dist/ReactToastify.css';




function App() {

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/forgotpassword">
          <ForgotPassword />
        </Route>
        <Route path="/">
          <File />
        </Route>
      </Switch >
    </Router>
  );
}

export default App;
