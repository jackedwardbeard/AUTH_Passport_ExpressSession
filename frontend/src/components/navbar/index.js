import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import logo from '../../images/smiley.png'
import {FaBars} from 'react-icons/fa' // mobile menu icon
import axios from 'axios'
import { UserContext } from '../../Context/User'

const Navbar = ({reverseState}) => {

    // fetch user details from global 'useContext' state
    const [user, setUser] = useContext(UserContext);

    // log user out (end session)
    const logout = async(e) => {
        e.preventDefault()

        const res = await axios.get('http://localhost:5000/logout', {withCredentials: true});
        console.log(res);

        // reset global state user
        if (res.status === 200) {
            setUser(null);
        }   
    }

    return (
        <div className='navContainer'>
            <Link className='logo_link' to='/'>
                <img className='logo' src={logo}></img>
            </Link>
            <div className='mobileIcon' onClick={reverseState}>
                <FaBars/>
            </div>
            <ul className='links'>
                {
                    // if user is logged in, show home and logout links
                    user ?
                    <>
                        <li>
                            <Link className='nav_link' to='/'>Home</Link>
                        </li>
                        <li>
                            <Link className='nav_link' onClick={logout}>Logout</Link>
                        </li>
                    </>
                    :
                    // otherwise, show home, register and login links
                    <>
                        <li>
                            <Link className='nav_link' to='/'>Home</Link>
                        </li>
                        <li>
                            <Link className='nav_link' to='/register'>Register</Link>
                        </li>
                        <li>
                            <Link className='nav_link' to='/login'>Login</Link>
                        </li>
                    </>
                }
                
            </ul>
        </div>
    )
}

export default Navbar
