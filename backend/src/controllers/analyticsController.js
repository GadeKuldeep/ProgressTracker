const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const PomodoroSession = require('../models/PomodoroSession');
const Reflection = require('../models/Reflection');

// @desc    Get analytics data
// @route   GET /api/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    // Goals stats
    const allGoals = await Goal.find({ user: userId });
    const completedGoals = allGoals.filter(g => g.completed);
    const avgProgress = allGoals.length > 0
      ? Math.round(allGoals.reduce((sum, g) => sum + g.progress, 0) / allGoals.length)
      : 0;

    // Habits stats
    const habits = await Habit.find({ user: userId });
    const totalHabits = habits.length;

    // Weekly habit completion data
    const weeklyHabitData = last7Days.map(date => {
      const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
      return {
        date,
        day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
        completed: completedCount,
        total: totalHabits,
        percentage: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0
      };
    });

    // Today's habit completion
    const todayHabitsCompleted = habits.filter(h => h.completedDates.includes(today)).length;

    // Pomodoro stats
    const todayPomodoros = await PomodoroSession.countDocuments({ user: userId, date: today });
    const weekPomodoros = await PomodoroSession.countDocuments({
      user: userId,
      date: { $in: last7Days }
    });

    // Focus heatmap (last 30 days)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(d.toISOString().split('T')[0]);
    }

    const heatmapData = await Promise.all(last30Days.map(async (date) => {
      const habitsCount = habits.filter(h => h.completedDates.includes(date)).length;
      const pomodoroCount = await PomodoroSession.countDocuments({ user: userId, date });
      const goalsCompletedOnDate = allGoals.filter(g =>
        g.completedAt && g.completedAt.toISOString().split('T')[0] === date
      ).length;

      const intensity = Math.min(4, habitsCount + pomodoroCount + goalsCompletedOnDate);
      return { date, intensity };
    }));

    // Reflections count
    const reflectionsCount = await Reflection.countDocuments({ user: userId });

    // Calculate focus score (0-100)
    const habitScore = totalHabits > 0 ? (todayHabitsCompleted / totalHabits) * 40 : 0;
    const goalScore = allGoals.length > 0 ? (completedGoals.length / allGoals.length) * 30 : 0;
    const pomodoroScore = Math.min(30, todayPomodoros * 10);
    const focusScore = Math.round(habitScore + goalScore + pomodoroScore);

    res.json({
      overview: {
        totalGoals: allGoals.length,
        completedGoals: completedGoals.length,
        avgProgress,
        totalHabits,
        todayHabitsCompleted,
        todayPomodoros,
        weekPomodoros,
        reflectionsCount,
        focusScore
      },
      weeklyHabitData,
      heatmapData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
