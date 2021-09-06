const mongoose = require('mongoose'); //db
const express = require('express'); //server
const cors = require('cors'); //cross origin resource sharing
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./user')
const sendEmail = require('./sendEmail'); // import function for sending an email

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
    origin: "http://localhost:3000", // allows CORS from 'origin' - change to '*' to allow access from anywhere
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
                res.send({"id": req.user.id, "firstName": req.user.firstName, "lastName": req.user.lastName, "email": req.user.email, "confirmedEmail": req.user.confirmedEmail});
            })
        }
    }) (req, res, next);
})

// /register is an HTTP POST method. Client POSTS register form data to backend to be created as a user.
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
                sendEmail(req.body.email, savedNewUser._id);

                res.send('Registered into DB successfully!');
            }
            
            else {
                res.send('Passwords mismatch! Could not register.')
            }
        }
    });
})

// once the button for email confirmation is clicked, update the DB to mark the user's email as confirmed
app.post('/confirmEmail', (req, res) => {

    const userID = req.body.userid;
    let confirmedEmail = null;

    console.log('got incoming id:', userID);

    // if email hasn't been confirmed
    User.findById(userID, function (err, result) {

        if (err) {
            console.log(err);
        }

        else {
            // only update if email isn't already confirmed
            confirmedEmail = result.confirmedEmail;
            
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
                        res.send("Email successfully confirmed!");
                      }
                    }
                );
            }
        
            // if it has
            else {
                res.send('Email already confirmed!');
            }
        }
    });

    console.log('confirmed email:', confirmedEmail)
    
})

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
