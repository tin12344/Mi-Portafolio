const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        ref: 'User'
      },
    user_name: { type: String },
    prompt_name: { type: String },
    prompt: { type: String },
    n: { type: Number},
    size: { type: String },
    response: { type: Array },
    tag: { type: Array },
});

module.exports = mongoose.model('PromptsImage', userSchema);