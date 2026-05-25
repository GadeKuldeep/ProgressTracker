const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add reflection content'],
    maxlength: 5000
  },
  mood: {
    type: String,
    enum: ['peaceful', 'focused', 'grateful', 'thoughtful', 'energized', 'calm'],
    default: 'calm'
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reflection', reflectionSchema);
