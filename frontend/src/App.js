import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login';
import Logout from './components/Logout';

const responseGoogle = (response) => {
  console.log(response.profileObj);
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch >
    </Router>
  );
}

export default App;
