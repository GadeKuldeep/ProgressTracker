const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
    maxlength: 200
  },
  notes: {
    type: String,
    default: '',
    maxlength: 1000
  },
  deadline: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

goalSchema.pre('save', function (next) {
  if (this.progress === 100 && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
  if (this.completed && this.progress < 100) {
    this.progress = 100;
    this.completedAt = this.completedAt || new Date();
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
