const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a habit name'],
    trim: true,
    maxlength: 100
  },
  completedDates: [{
    type: String // Store as YYYY-MM-DD strings for easy comparison
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#9ca3af'
  }
}, {
  timestamps: true
});

// Method to calculate streaks
habitSchema.methods.calculateStreak = function () {
  if (this.completedDates.length === 0) {
    this.currentStreak = 0;
    return;
  }

  const sorted = [...this.completedDates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Check if the most recent date is today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) {
    this.currentStreak = 0;
    return;
  }

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1]);
    const prev = new Date(sorted[i]);
    const diffDays = Math.round((current - prev) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  this.currentStreak = streak;
  if (streak > this.longestStreak) {
    this.longestStreak = streak;
  }
};

module.exports = mongoose.model('Habit', habitSchema);
