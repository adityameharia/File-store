import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginHooks from './components/Login';
import File from './components/File';

const responseGoogle = (response) => {
  console.log(response.profileObj);
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginHooks />
        </Route>
        <Route path="/">
          <File />
        </Route>
      </Switch >
    </Router>
  );
}

export default App;
