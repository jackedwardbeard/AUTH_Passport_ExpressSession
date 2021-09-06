const mongoose = require('mongoose'); //db
const express = require('express'); //server
const cors = require('cors'); //cross origin resource sharing
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./user')

// initialise backend
const app = express()

// connect to mongoose (an ODM/object document mapper) for mongoDB
// this link (or the username and password) should be made private (e.g. as a .env variable) in production
mongoose.connect(
'mongodb+srv://[databaseUsernameGoesHereWithoutBrackets]:[databaseUserPasswordGoesHereWithoutBrackets]@cluster0.0g8h8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
},
() => {console.log('Connected successfully to Mongoose!')}
)

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
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true
}))

// allows the parsing of cookies
app.use(cookieParser('secretcode'))

// sets up our passport, and uses our passport config that we wrote
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);


// /login is an HTTP POST method. Client POSTS login form data to backend to be authenticated.
app.post('/login', (req, res, next) => {

    // authenticate the user using our local passport strategy
    passport.authenticate('local', (err, user, info) => {

        // if error, throw error
        if (err) {
            throw err
        };

        // if a user is not returned, it means they couldn't be authenticated
        if (!user) {
            res.send('Your email or password is incorrect.')
        }

        // if a user is returned, they have been authenticated, sign them in to a session.
        else {
            req.login(user, (err) => {

                // if error, throw error
                if (err) {
                    throw err
                }

                // if no error, log in is successful
                res.send('You have been authenticated! Hello there!');
                
                // once log-in is successful for a user, req.user is appended to any requests they make
                console.log(req.user);
            })
        }
    })(req, res, next);
})

// /register is an HTTP POST method. Client POSTS register form data to backend to be created as a user.
app.post('/register', (req, res) => {

    // findOne looks for a document in the DB with an arbitrary condition to search for
    // (email in this case), doc is the document we may or may not get back from this function
    User.findOne({email: req.body.email}, async (err, doc) => {

        // catch errors
        if (err) {
            throw err
        };

        // if we find an existing user with matching email, console log it and don't allow a new user to be created
        if (doc) {
            res.send('A user already exists with that email!')
        }

        // if there is no matching email in any existing DB documents, make a new user in the DB
        if (!doc) {
            const pword = req.body.password;
            const pwordConfirm = req.body.confirmPassword;
            // encrypt the password the user gives, so it is not stored as plaintext in the DB
            const hashedPword = await bcrypt.hash(req.body.password, 10);
            // if passwords in the register form match and there is no existing email in the DB, create a new user
            if (pword == pwordConfirm) {
                const newUser = new User({
                    email: req.body.email,
                    password: hashedPword,
                });
                await newUser.save();
                res.send('Registered into DB successfully!');
            }
            
            else {
                res.send('Passwords mismatch! Could not register.')
            }
        }
    })
})

// /user is an HTTP GET method. Client asks to GET data from the backend, which communicates with the DB to find the current user's details.
app.get('/getUser', (req, res) => {
    res.send(req.user);
});

// log the user out
app.get('/logout', (req, res) => {
    req.logout(req.user)
    res.send('You have successfully logged out!')
})

// Make the server listen to a specific port (5000 in this case)
app.listen(5000, () => {
    console.log('Server is listening on port 5000');
})
