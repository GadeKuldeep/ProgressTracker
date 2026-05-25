const express = require('express');
const router = express.Router();
const { logSession, getTodaySessions } = require('../controllers/pomodoroController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', logSession);
router.get('/today', getTodaySessions);

module.exports = router;
