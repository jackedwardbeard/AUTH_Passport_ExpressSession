import './App.css'
import { 
  BrowserRouter as Router, 
  Route, 
  Switch 
} from 'react-router-dom'
import {
  Landing,
  Login,
  Register
} from './pages/imports.js'
import React from 'react'


function App() {

  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Landing}/>
      </Switch>
    </Router>
  );
}

export default App;
