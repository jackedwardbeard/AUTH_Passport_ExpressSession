import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import './index.css'

const PasswordChange = (props) => {

    // get user ID ( {userid: 'example-id-here'} ) passed as parameter to this page
    const userID = props.match.params.userid;

    const history = useHistory();

    // for dialog pop-ups
    const [open, setOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [resStatus, setResStatus] = useState(null);

    // open dialog pop-up
    const handleOpen = () => {
        setOpen(true);
    }

    // close dialog pop-up
    const handleClose = () => {
        setOpen(false);

        // if password change was successful, redirect to login page
        if (resStatus === 200) {
            history.push('/login')
        }
    }

    // take input and reset the user's password to the new input
    const passwordChange = async() => {

        // if passwords match
        if (newPassword === confirmNewPassword) {
            const data = {
                'newPassword': newPassword,
                'userid': userID
            }
    
            // if passwords match
            if (newPassword === confirmNewPassword) {
                await axios.post('http://localhost:5000/passwordChange', data)
                .then((res) => {
                    console.log(res);
                    setResStatus(200);
                    setDialogText('Password successfully updated!');
                    handleOpen();
                })
                .catch((err) => {
                    console.log(err.response);
                    setDialogText(err.response.data);
                    handleOpen();
                })
    
            }
    
        }

        // passwords mismatch
        else {
            setDialogText('Passwords mismatch!');
            handleOpen();
        }

    }

    return (

        <div>
            <div className='pageContainer'>
            <div className='passwordChangeRow1'>
                <p className='title'>Change Password</p>
                <p className='passwordChangeText'>Enter a new password.</p>
                <input 
                    className='inputBox' 
                    type='password' 
                    placeholder='New Password'
                    onChange={e => setNewPassword(e.target.value)}
                />
                <input 
                    className='inputBox' 
                    type='password' 
                    placeholder='Confirm New Password'
                    onChange={e => setConfirmNewPassword(e.target.value)}
                />
                <Button variant='contained' onClick={passwordChange} style={{margin: '30px'}}>Change Password</Button>
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

export default PasswordChange
