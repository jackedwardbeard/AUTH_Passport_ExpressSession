import React, {useContext} from 'react'
import { UserContext } from '../../Context/User'
import './index.css'

const Landing = () => {

    // fetch user details from global 'useContext' state
    const [user, setUser] = useContext(UserContext);

    console.log('landing user:', user);

    return (

        <div className='pageContainer'>
            <div className='landingRow1'>
                {
                    user ?
                    <>
                        <p className='landingTitle'>
                        Welcome back, {user.email}!
                        </p>
                        <p className='landingSubTitle'>Current User Details</p>
                        <p className='landingSubText'>First Name: {user.firstName}</p>
                        <p className='landingSubText'>Last Name: {user.lastName}</p>
                        <p className='landingSubText'>Email: {user.email}</p>
                        <p className='landingSubText'>Confirmed Email: {JSON.stringify(user.confirmedEmail)}</p>
                    </>
                    :
                    <p className='landingTitle'>
                        Nobody is logged in!
                    </p>
                }
            </div>
        </div>
        
        )
};

export default Landing
