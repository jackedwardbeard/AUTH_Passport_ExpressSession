import React, {useState} from 'react'
import './index.css'
import Navbar from '../../components/navbar'
import { Link } from 'react-router-dom'
import Axios from 'axios'

const Login = () => {

    // state for tracking login form input
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // state for holding user session data
    const [sessionData, setSessionData] = useState(null)

    // functions for sending login form data to backend
    const login = (e) => {
    e.preventDefault()
        Axios({
            method: 'POST',
            data: {
                email: loginEmail,
                password: loginPassword
            },
            withCredentials: true,
            url: 'http://localhost:5000/login'
        }).then((res) => {console.log(res)})
    };
    const getUser = (e) => {
    e.preventDefault()
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:5000/getUser",
          }).then((res) => {
            // extract the user's email (res.data) from our current session data (res)
            setSessionData(res.data)
            console.log('The email of the currently logged in user is:', res.data)
        })
    }

    const logout = (e) => {
    e.preventDefault()
        Axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:5000/logout"
        }).then((res) => {
            console.log(res);
        })
    }

    return (
    <>
    <Navbar></Navbar>
    <div className='pageContainer'>
        <form className='form'> 
            <p className='title'>
                Sign In
            </p>
            <input 
            className='inputBox' 
            type='text' 
            placeholder='Email'
            onChange={e => setLoginEmail(e.target.value)}
            ></input>
            <input 
            className='inputBox' 
            type='password' 
            placeholder='Password'
            onChange={e => setLoginPassword(e.target.value)}
            ></input>
            <button onClick={login} className='button'>Sign In</button>
            <button onClick={getUser} className='button'>Get User Details</button>
            <button onClick={logout} className='button'>Logout</button>
            <a className='register_link'>
                <Link to='/register'>Not a member? Register now.</Link>
            </a>
        </form>
    </div>
    </>
    )
};

export default Login