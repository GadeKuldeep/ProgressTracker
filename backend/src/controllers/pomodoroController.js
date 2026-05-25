const PomodoroSession = require('../models/PomodoroSession');

// @desc    Log a completed pomodoro session
// @route   POST /api/pomodoro
exports.logSession = async (req, res) => {
  try {
    const { duration } = req.body;
    const date = new Date().toISOString().split('T')[0];

    const session = await PomodoroSession.create({
      user: req.user._id,
      duration: duration || 25,
      date
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's sessions
// @route   GET /api/pomodoro/today
exports.getTodaySessions = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sessions = await PomodoroSession.find({
      user: req.user._id,
      date: today
    }).sort({ completedAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
