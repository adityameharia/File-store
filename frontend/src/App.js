import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginHooks from './components/Login';
import File from './components/File';
import 'react-toastify/dist/ReactToastify.css';



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
