const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    resetToken: { type: String, required: false }, 
    resetTokenExpiration: { type: Date, required: false },
    deletionToken: String,
    deletionTokenExpiration: Date
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

