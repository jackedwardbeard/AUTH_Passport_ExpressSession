const mongoose = require('mongoose'); // db operations
const express = require('express'); // server
const cors = require('cors'); // cross origin resource sharing
const passport = require('passport'); // authentication strategies
const bcrypt = require('bcryptjs'); // hashing/salting passwords
const session = require('express-session'); // maintain user sessions
const cookieParser = require('cookie-parser'); // parse cookies
const User = require('./user') // db schema for a user
const {sendConfirmationEmail, sendPasswordResetEmail} = require('./sendEmail'); // different templates for sending emails

// enable environment variables
require('dotenv').config()

// initialise backend
const app = express()

// lets us get json data from req.body
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// sets up cross origin resource sharing
app.use(cors({
    origin: process.env.CLIENT_URL, // allows CORS from 'origin' - change to '*' to allow access from anywhere
    credentials: true
}))

// sets up express-session
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))

// allows the parsing of cookies
app.use(cookieParser(process.env.SECRET))

// sets up our passport, and uses our passport config to set it up
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);


// log the user in using local passport strategy
app.post('/login', (req, res, next) => {

    // authenticate the user using our local passport strategy
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            res.send(err);
        };

        // if authentication failed
        if (!user) {
            res.send('Your email or password is incorrect.')
        }

        // if authentication was successful
        else {
            req.login(user, (err) => {

                if (err) {
                    throw err
                }

                // if no errors, log in is successful, send user details to client
                console.log('You have been authenticated! Hello there!');
                res.send({'id': req.user.id, 'firstName': req.user.firstName, 'lastName': req.user.lastName, 'email': req.user.email, 'confirmedEmail': req.user.confirmedEmail});
            })
        }
    }) (req, res, next);
})

// /register is an HTTP POST method. Client POSTS register form data to backend to be created as a user.
// accepts form inputs from frontend register page
app.post('/register', (req, res) => {

    // check if a user with the given email already exists
    User.findOne({email: req.body.email}, async (err, doc) => {

        if (err) {
            res.send(err);
        };

        // if user already exists, don't register
        if (doc) {
            res.send('A user already exists with that email!');
        }

        // if user doesn't exist, register a new user
        if (!doc) {
            const pword = req.body.password;
            const pwordConfirm = req.body.confirmPassword;
            // encrypt the password the user gives, so it is not stored as plaintext in the DB
            const hashedPword = await bcrypt.hash(req.body.password, 10);

            // if passwords in the register form match and there is no existing email in the DB, create a new user
            if (pword === pwordConfirm) {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPword,
                    confirmedEmail: false
                });

                // get details (including uuid) of this newly registered user
                const savedNewUser = await newUser.save();
                
                // send confirmation email with email address and uuid attached
                sendConfirmationEmail(req.body.email, savedNewUser._id);

                res.send('Registered into DB successfully!');
            }
            
            else {
                res.send('Passwords mismatch! Could not register.')
            }
        }
    });
})

// once the button for email confirmation is clicked, update the DB to mark the user's email as confirmed
// accepts a userid
// e.g. data = {
//      'userid': userid
//    }
app.post('/confirmEmail', (req, res) => {

    const userID = req.body.userid;
    let confirmedEmail = null;

    console.log('got incoming id:', userID);

    // if email hasn't been confirmed
    User.findById(userID, (err, result) => {

        if (err) {
            res.send("Error");
        }

        else {
            
            confirmedEmail = result.confirmedEmail;
            
            // only update if email isn't already confirmed
            if (confirmedEmail === false) {
                User.findByIdAndUpdate(
                    { _id: userID },
                    { confirmedEmail: true },
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        res.send(err);
                      } 
                      else {
                        console.log(result);
                        res.send('Email successfully confirmed!');
                      }
                    }
                );
            }
        
            // if it has been confirmed already
            else {
                res.send('Email already confirmed!');
            }
        }
    });

    console.log('confirmed email:', confirmedEmail)
    
})

// accepts an email
// e.g. data = {
//      'email': email 
//   }
app.post('/sendResetEmail', (req, res) => {
    
    const email = req.body.email;

    // look for an existing user with the email input from the send reset email page
    User.find({email: email}, (err, result) => {
        
        if (err) {
            res.send('An error occured.');
        }

        else {

            // if user was found
            if (result && result.length > 0) {

                // get user ID associated with incoming email address
                const userID = result[0]._id;
        
                // send a password reset email with their userID as the URL parameter
                sendPasswordResetEmail(email, userID);
                
                res.send('An email containing instructions on how to reset your password has been sent.');
            }

            else {
                // if no user was found
                res.send('No account was found linked to that email.');
            }   
        }
    })
});

// accepts a userID and a new password
// e.g. data = {
//    'userid': userid,
//    'newPassword': newPassword
//    }
app.post('/passwordChange', async(req, res) => {
    
    const userID = req.body.userid;
    // hash and salt new password with bcrypt
    const newPasswordHashed = await bcrypt.hash(req.body.newPassword, 10);

    // find user associated with userid, update password
    User.findOneAndUpdate({_id: userID}, {$set: {password: newPasswordHashed}}, (err, result) => {

        if (err) {
            console.log('An error occurred.');
        }
    
        else {
        
            // if user found
            if (result) {
                res.send('Password successfully updated!');
            }

            // no user could be found with the given req userID
            else {
                res.send('Invalid userID provided.');
            }
        }
        
    });

});

// return logged-in user data
app.get('/getUser', (req, res) => {
    res.send(req.user);
});

// log the user out (end the express session)
app.get('/logout', (req, res) => {
    req.logout(req.user)
    res.send('You have successfully logged out!')
})

// make the server listen to a specific port (5000 in this case)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(5000, () => console.log('Server Running on Port 5000, Connected to DB')))
  .catch((error) => console.log(`${error} did not connect`));

// lets us use certain 'deprecated' mongoose operations
mongoose.set('useFindAndModify', false);
