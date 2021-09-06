# MERN_Authentication
A local authentication system Using a React/Node/Express/MongoDB stack.
* Note: req.user is shorthand/equivalent to req.session.user (using expression session).

# To make it work
You need to change the mongoDB URL (in server.js) to your own, with your database username and password included.

# To-Dos / Improvements
- Add an option to reset password (easy enough, send another email and only update the password after a button is clicked (linked to by the email))
- Add a confirmation email before adding the user to the DB when registering (same as above)
- Only show a logout button if there is a flag indicating a user is logged in (e.g. if req.user != null)
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
