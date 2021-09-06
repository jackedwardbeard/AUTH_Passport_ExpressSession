const mongoose = require('mongoose');

// create a mongoDB schema for a regular user
const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirmedEmail: Boolean
});

// export this schema as 'User'
module.exports = mongoose.model('User', user);