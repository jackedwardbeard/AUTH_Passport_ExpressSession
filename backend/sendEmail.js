const nodemailer = require('nodemailer');

// send an email to confirm the new user's email address
const sendConfirmationEmail = (emailAddress, userID) => {
    // smtp is used to send the email, with the given credentials as the sender
    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // structure the email to send
    const email = {
        from: 'Auth Demo App', // sender address
        to: emailAddress, // receiver address(es)
        subject: 'AUTH DEMO: Confirm Your Email', // subject line
        html: `
        Thanks for registering. To finalise the process,
        <a href='${process.env.CLIENT_URL}/confirm/${userID}'>
          click to confirm your email address. 
        </a>
        If this wasn't you, ignore this email.
      `, // email body in html
    };

    // send the email
    smtpTransport.sendMail(email, function (error, response) {
        // if unsuccessful
        if (error) {
            console.log(error);
        }

        // if successful
        else {
            console.log('Email sent successfully!');
        }

        smtpTransport.close();
    });
};

// send an email to confirm the new user's email address
const sendPasswordResetEmail = (emailAddress, userID) => {
    // smtp is used to send the email, with the given credentials as the sender
    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // structure the email to send
    const email = {
        from: 'Auth Demo App', // sender address
        to: emailAddress, // receiver address(es)
        subject: 'AUTH DEMO: You Requested A Change Of Password', // subject line
        html: `
        If it was you who requested this change,
        <a href='${process.env.CLIENT_URL}/passwordchange/${userID}'>
          click to reset your password. 
        </a>
        Otherwise, you can ignore this email.
      `, // email body in html
    };

    // send the email
    smtpTransport.sendMail(email, function (error, response) {
        // if unsuccessful
        if (error) {
            console.log(error);
        }

        // if successful
        else {
            console.log('Email sent successfully!');
        }

        smtpTransport.close();
    });
};

module.exports = {sendConfirmationEmail, sendPasswordResetEmail};