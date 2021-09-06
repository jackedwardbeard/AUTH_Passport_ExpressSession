const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
    
    passport.use(

        // set up a local strategy for authenticating a login request
        new localStrategy({usernameField: "email", passwordField: "password"}, (email, password, done) => {
        
            // look for an email in our DB matching the form email input
            User.findOne({ email: email }, (err, user) => {

                if (err) throw err;
                
                // if no matching email, return no error, no user
                if (!user) return done(null, false);

                // if user exists, compare the given form password to the encrypted DB password
                bcrypt.compare(password, user.password, (err, result) => {
                    
                    if (err) throw err;

                    // if passwords match, return no error, and the user
                    if (result === true) {
                        return done(null, user);
                    } 
                    
                    // if passwords don't match, return no error, no user
                    else {
                        return done(null, false);
                    }

                });
            });
        })
    );

    // takes a user and gives them a cookie, which has its own ID
    passport.serializeUser((user, done) => {

        done(null, user.id);

    });

    // takes a cookie, unwraps it, and returns a user (if any), assosciated with its ID.
    passport.deserializeUser((id, done) => {
        
        // look for ids (primary key referenced by _id) in DB that match ID of our cookie we are unwrapping.
        User.findOne({ _id: id }, (err, user) => {
        
            // if we get an error trying to find a user associated with the cookie
            if (err) throw err;
        
            // if no errors
            // this is what will be returned by req.user on incoming requests - can always change to include more/less info
            const userInformation = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                confirmedEmail: user.confirmedEmail
            };

            // return error status + userInformation
            done(err, userInformation);

        });
    });
};