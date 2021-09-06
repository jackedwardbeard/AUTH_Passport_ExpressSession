import React, {useState, useContext} from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../Context/User'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const Login = () => {

    // used to redirect to home page upon successful login
    const history = useHistory();

    // state for tracking login form input
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const [user, setUser] = useContext(UserContext);

    // determine whether to redirect after closing dialog pop-up or not
    const [resStatus, setResStatus] = useState(null);

    // for dialog pop-ups
    const [open, setOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');

    // open dialog pop-up
    const handleOpen = () => {
        setOpen(true);
    }

    // close dialog pop-up
    const handleClose = () => {
        setOpen(false);

        // if user's email has been confirmed, redirect to login
        if (resStatus === 200) {
            history.push('/');
        }
    }

    // log user in (create session)
    const login = async(e) => {
        e.preventDefault()

        const data = {
            email: loginEmail,
            password: loginPassword
        }

        // only allow login if a user isn't already logged in
        if (!user) {
            const res = await axios.post('http://localhost:5000/login', data, {withCredentials: true});
            
            // if login was successful (an object containing user details is returned)
            if (typeof res.data === 'object') {
                // update global user state to the newly logged in user
                setUser(res.data);
                setResStatus(200);
                setDialogText('Successfully logged in!');
                handleOpen();
            }

            // login was unsuccessful
            else {
                setDialogText('Your email or password is incorrect!');
                handleOpen();
            }

            console.log(res);
        }
        
        else {
            setDialogText('Log out before attempting to log in!');
            handleOpen();
        }
    };

    return (

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
            />
            <input 
                className='inputBox' 
                type='password' 
                placeholder='Password'
                onChange={e => setLoginPassword(e.target.value)}
            />
            <button onClick={login} className='buttonLogin'>
                Sign In
            </button>
            <a className='register_link'>
                <Link to='/register'>Not a member? Register now.</Link>
            </a>
        </form>
        <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle> </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            { dialogText }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Okay
                        </Button>
                    </DialogActions>
            </Dialog>
    </div>

    )
};

export default Login