const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  nickname: { type: String }, // Optional: store the user's nickname for display
  endorsements: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Idea', ideaSchema);
