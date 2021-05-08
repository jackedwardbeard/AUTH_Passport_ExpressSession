import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import logo from '../../images/smiley.png'
import {FaBars} from 'react-icons/fa' // mobile menu icon
import Axios from 'axios'

const Navbar = ({reverseState}) => {

    const logout = (e) => {
        e.preventDefault()
            Axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:4000/logout"
            }).then((res) => {
                console.log(res);
            })
    }

    return (
        <div className='navContainer'>
            <Link className='logo_link' to='/landing'>
                <img className='logo' src={logo}></img>
            </Link>
            <div className='mobileIcon' onClick={reverseState}>
                <FaBars/>
            </div>
            <ul className='links'>
                <li>
                    <Link className='nav_link' to='/register'>Register</Link>
                </li>
                <li>
                    <Link className='nav_link' to='/login'>Login</Link>
                </li>
                <li>
                    <Link className='nav_link' to='/login' onClick={logout}>Logout</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
