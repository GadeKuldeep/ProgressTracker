const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 25
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);
