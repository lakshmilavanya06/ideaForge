const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  endorsements: { type: Number, default: 0 },
  submittedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }]
});

module.exports = mongoose.model('User', userSchema);
