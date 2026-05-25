const Reflection = require('../models/Reflection');

// @desc    Get reflections for user
// @route   GET /api/reflections
exports.getReflections = async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    const reflections = await Reflection.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(limit));
    res.json(reflections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update reflection for a date
// @route   POST /api/reflections
exports.createReflection = async (req, res) => {
  try {
    const { content, mood, date } = req.body;
    const dateStr = date || new Date().toISOString().split('T')[0];

    // Upsert — one reflection per day
    const reflection = await Reflection.findOneAndUpdate(
      { user: req.user._id, date: dateStr },
      { content, mood: mood || 'calm', date: dateStr, user: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(reflection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reflection
// @route   DELETE /api/reflections/:id
exports.deleteReflection = async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);
    if (!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }
    if (reflection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Reflection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reflection removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
