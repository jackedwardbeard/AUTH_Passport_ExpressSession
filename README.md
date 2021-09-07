# MERN_Authentication
A MERN stack which uses Express-Session + Passport.js for local authentication.
* Note: req.user is shorthand/equivalent to req.session.user (using expression session).

# To make it work
You need to create a backend .env file containing values for:
* MONGO_URL=yourConnectionStringHere
* SECRET=anySecretHere
* CLIENT_URL=http://localhost:3000
* EMAIL_USER=yourGmailAddress
* EMAIL_PASS=yourGmailPassword

# What it does so far
* Allows local register
* Upon successful register (successful if provided email isn't taken/found in DB), send a confirmation email to the given email address
* Following the link in the confirmation email brings you to a confirmation page, where you can click a button to confirm your email
* Successfully confirmation of your email will redirect you to the login page, whilst an unsucessful confirmation (i.e., already confirmed, or no user found for given ID) will leave you on the confirmation page
* Allows local login (successful if email/password combination is found in DB)
* Allows persistent login (e.g, if you refresh the page after logging in, you will still be logged in, until the server stops/restarts).
* On login page, offers a 'forgot password?' option, which takes you to a page where you can enter an email to send a password reset email to. Following the link will take you to a page where you can reset your password (if the new password and confirmed new password match).
* Allows logout

# To-Dos / Improvements
- Add more passport strategies (e.g. a google strategy for logging in/registering with google instead of a local email/password)
- Add input validation (not the focus of this repo, so I probably won't implement this). Currently you can enter anything into the any input fields.

# To start frontend
```bash
cd frontend
npm install
npm start
```

# To start backend (with nodemon)
```bash
cd backend
npm install
npm start
```

# Description

I was working on authentication for another project, and decided it would be helpful to encapsulate this authentication stack into a little package for learning purposes.


# The stack
```bash
React (frontend)
Node/Express (backend)
MongoDB (database)
```
