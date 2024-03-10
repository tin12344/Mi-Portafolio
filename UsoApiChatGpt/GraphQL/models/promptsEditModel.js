const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        ref: 'User'
      },
    user_name: { type: String },
    prompt_name: { type: String },
    model: { type: String },
    input: { type: String },
    instruction: { type: String },
    response: { type: String },
    temperature: { type: Number },
    tag: { type: Array },
});

module.exports = mongoose.model('PromptsEdit', userSchema);