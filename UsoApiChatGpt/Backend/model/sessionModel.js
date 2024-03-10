const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
    user: { type: String },
    token: { type: String },
    expire: { type: Date }
});

module.exports = mongoose.model('Session', sessionSchema);