const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    user_name: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone: { type: String },
    role: { type: String },
    password: { type: String },
    two_factor: { type: Boolean },
    state: { type: Boolean },
    two_factor_code: { type: String }
});

module.exports = mongoose.model('User', userSchema);