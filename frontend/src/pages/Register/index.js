import React, {useState} from 'react'
import './index.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const Register = () => {

    // used to redirect
    const history = useHistory();

    // state for keeping track of register form inputs
    const [registerFirstName, setRegisterFirstName] = useState('')
    const [registerLastName, setRegisterLastName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

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
            history.push('/login');
        }
    }

    // attempt to register
    const register = async(e) => {
        e.preventDefault();

        const data = {
            firstName: registerFirstName,
            lastName: registerLastName,
            email: registerEmail,
            password: registerPassword,
            confirmPassword: registerConfirmPassword
        };

        const res = await axios.post('http://localhost:5000/register', data, { withCredentials: true });
        
        // if register was successful, redirect to login
        if (res.data === 'Registered into DB successfully!') {
            setResStatus(200);
            setDialogText('User successfully registered! Check your inbox to finalise the process.');
            handleOpen();
        }
        
        else {
            setDialogText('That email is already taken!');
            handleOpen();
        }

        console.log(res);

    };

    return (

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
                />
                <input 
                    className='inputBox' 
                    type='text' 
                    placeholder='Last Name'
                    onChange={e => setRegisterLastName(e.target.value)}
                />
                <input 
                    className='inputBox' 
                    type='text' 
                    placeholder='Email'
                    onChange={e => setRegisterEmail(e.target.value)}
                />
                <input 
                    className='inputBox' 
                    type='password' 
                    placeholder='Password'
                    onChange={e => setRegisterPassword(e.target.value)}
                />
                <input 
                    className='inputBox' 
                    type='password' 
                    placeholder='Confirm Password'
                    onChange={e => setRegisterConfirmPassword(e.target.value)}
                />
                <Button variant='contained' onClick={register} style={{margin: '30px'}}>Register</Button>
                <Link className='link' to='/login'>Already a member? Sign in.</Link>
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
                        <Button onClick={handleClose} color='primary'>
                            Okay
                        </Button>
                    </DialogActions>
            </Dialog>
        </div>

        )
};

export default Register