const Habit = require('../models/Habit');

// @desc    Get all habits for user
// @route   GET /api/habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create habit
// @route   POST /api/habits
exports.createHabit = async (req, res) => {
  try {
    const { name, color } = req.body;
    const habit = await Habit.create({
      user: req.user._id,
      name,
      color: color || '#9ca3af'
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle habit completion for a date
// @route   PUT /api/habits/:id/toggle
exports.toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { date } = req.body; // YYYY-MM-DD
    const dateStr = date || new Date().toISOString().split('T')[0];

    const index = habit.completedDates.indexOf(dateStr);
    if (index > -1) {
      habit.completedDates.splice(index, 1);
    } else {
      habit.completedDates.push(dateStr);
    }

    habit.calculateStreak();
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, color } = req.body;
    if (name) habit.name = name;
    if (color) habit.color = color;

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
