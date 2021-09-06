import './App.css'
import { 
  BrowserRouter as Router, 
  Route, 
  Switch 
} from 'react-router-dom'
import {
  Landing,
  Login,
  Register,
  ConfirmEmail
} from './pages/pageExports'
import {
  Navbar,
  MobileMenu
} from './components/componentExports'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { UserContext } from './Context/User'

const App = () => {

  // store details of logged-in user - pass into context to act as global state
  const [user, setUser] = useState(null);

  // open/close mobile menu
  const [clicked, setClicked] = useState(false)
  const reverseState = () => { setClicked(!clicked) }

  // get email of logged-in user
  const getUser = async() => {
    const res = await axios.get('http://localhost:5000/getUser', {withCredentials: true})
    const fetchedUser = res.data;
    setUser(fetchedUser);
    console.log('Current user:', res);
}

  // fetch logged-in user's email once per page render
  useEffect(() => {
    getUser();
  }, [])

  return (
    <>
    <UserContext.Provider value={[user, setUser]}>
    <Router>
      <MobileMenu clicked={clicked} reverseState={reverseState}></MobileMenu>
      <Navbar reverseState={reverseState}/>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/confirm/:userid" component={ConfirmEmail}/>
        <Route path="/" component={Landing}/>
      </Switch>
    </Router>
    </UserContext.Provider>
    </>
  );
}

export default App;
