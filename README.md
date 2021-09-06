# MERN_Authentication
A local authentication system Using a React/Node/Express/MongoDB stack.
* Note: req.user is shorthand/equivalent to req.session.user (using expression session).

# To make it work
You need to create a backend .env file containing values for:
MONGO_URL=yourConnectionStringHere
SECRET=anySecretHere
CLIENT_URL=http://localhost:3000
EMAIL_USER=yourGmailAddress
EMAIL_PASS=yourGmailPassword

# To-Dos / Improvements
- Add an option to reset password (same process as register confirmation email)
- Add more passport strategies (e.g. a google strategy for logging in/registering with google instead of a local email/password)

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
