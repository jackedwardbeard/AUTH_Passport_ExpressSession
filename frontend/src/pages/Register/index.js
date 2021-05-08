import React, {useState} from 'react'
import './index.css'
import Navbar from '../../components/navbar'
import Axios from 'axios'
import { Link } from 'react-router-dom'

const Register = () => {

    // state for keeping track of register form inputs
    const [registerFirstName, setRegisterFirstName] = useState('')
    const [registerLastName, setRegisterLastName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

    // functions to send register form data to backend
    // these use axios to post/get HTTP requests between frontend/backend
    const register = (e) => {
    e.preventDefault()
        Axios({
            method: 'POST',
            data: {
                firstName: registerFirstName,
                lastName: registerLastName,
                email: registerEmail,
                password: registerPassword,
                confirmPassword: registerConfirmPassword
            },
            withCredentials: true,
            url: 'http://localhost:5000/register'
        }).then((res) => {console.log(res)}) //take the response from the server and console log it
    };

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
                Register
            </p>
            <input 
            className='inputBox' 
            type='text' 
            placeholder='First Name'
            onChange={e => setRegisterFirstName(e.target.value)}
            ></input>
            <input 
            className='inputBox' 
            type='text' 
            placeholder='Last Name'
            onChange={e => setRegisterLastName(e.target.value)}
            ></input>
            <input 
            className='inputBox' 
            type='text' 
            placeholder='Email'
            onChange={e => setRegisterEmail(e.target.value)}
            ></input>
            <input 
            className='inputBox' 
            type='password' 
            placeholder='Password'
            onChange={e => setRegisterPassword(e.target.value)}
            ></input>
            <input 
            className='inputBox' 
            type='password' 
            placeholder='Confirm Password'
            onChange={e => setRegisterConfirmPassword(e.target.value)}
            ></input>
            <button onClick={register} className='button'>Register</button>
            <button onClick={logout} className='button'>Logout</button>
            <a className='register_link'>
                <Link to='/login'>Already a member? Sign in.</Link>
            </a>
        </form>
    </div>
        </>
        )
};

export default Register