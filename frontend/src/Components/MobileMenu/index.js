import React, {useContext} from 'react'
import './index.css'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { UserContext } from '../../Context/User'

const MobileMenu = ({clicked, reverseState}) => {

    // fetch user details from global 'useContext' state
    const [user, setUser] = useContext(UserContext);

    // log user out (end session)
    const logout = async(e) => {
        e.preventDefault()

        await axios.get('http://localhost:5000/logout', {withCredentials: true})
        .then((res) => {
            console.log(res);
            setUser(null);
        })
        .catch((err) => {
            console.log(err.response);
        })
    }
    
    return (
        <div clicked={clicked} onClick={reverseState}>
            {
                clicked ? 
                <div className='mobileMenuContainerClicked'>
                    <ul className='mobileMenu'>
                        {
                            // if user is logged in, show home and logout links
                            user ?
                            <>
                                <Link className='mobileLink' to='/' onClick={reverseState}>Home</Link>
                                <Link className='mobileLink' onClick={logout}>Logout</Link>
                            </>
                            :
                            // otherwise show home, register and login links
                            <>
                                <Link className='mobileLink' to='/' onClick={reverseState}>Home</Link>
                                <Link className='mobileLink' to='/register' onClick={reverseState}>Register</Link>
                                <Link className='mobileLink' to='/login' onClick={reverseState}>Login</Link>
                            </>
                        }
                    </ul>
                </div>
                :
                <div className='mobileMenuContainerNotClicked'>
                </div>
            }
            
        </div>
    )
}

export default MobileMenu
