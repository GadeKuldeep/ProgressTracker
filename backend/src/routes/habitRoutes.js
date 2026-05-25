const express = require('express');
const router = express.Router();
const { getHabits, createHabit, toggleHabit, updateHabit, deleteHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

router.put('/:id/toggle', toggleHabit);

module.exports = router;
