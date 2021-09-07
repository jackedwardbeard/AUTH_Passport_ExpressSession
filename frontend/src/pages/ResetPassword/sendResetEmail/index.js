import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import './index.css'

const SendResetEmail = () => {

    const history = useHistory();

    // for dialog pop-ups
    const [open, setOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');

    const [email, setEmail] = useState('');

    const [resStatus, setResStatus] = useState(null);

    // open dialog pop-up
    const handleOpen = () => {
        setOpen(true);
    }

    // close dialog pop-up
    const handleClose = () => {
        setOpen(false);

        // if reset email sent correctly, redirect to home page after closing pop-up
        if (resStatus === 200) {
            history.push('/');
        }
    }

    const sendResetEmail = async() => {
        // take email entered into input box
        const res = await axios.post('http://localhost:5000/sendResetEmail', {
            'email': email
        });

        if (res.data === 'An email containing instructions on how to reset your password has been sent.') {
            setResStatus(200);
            setDialogText('An email containing instructions on how to reset your password has been sent.');
            handleOpen();
        }

        else {
            setDialogText('No account found with that email.');
            handleOpen();
        }
    }

    return (

        <div>
            <div className='pageContainer'>
            <div className='sendResetEmailRow1'>
                <p className='title'>Reset Password</p>
                <p className='sendResetEmailText'>Enter the email associated with your account.</p>
                <input 
                    className='inputBox' 
                    type='text' 
                    placeholder='Email'
                    onChange={e => setEmail(e.target.value)}
                />
                <Button variant='contained' onClick={sendResetEmail} style={{margin: '30px'}}>Send Reset Email</Button>
            </div>
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
        </div>

    )
}

export default SendResetEmail
