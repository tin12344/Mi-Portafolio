const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        ref: 'User'
      },
    model: { type: String },
    prompt_name: { type: String },
    prompt: { type: String },
    max_tokens: { type: Number},
    temperature: { type: Number },
    response: { type: String },
    tag: { type: Array },
});

module.exports = mongoose.model('PromptsCompletion', userSchema);