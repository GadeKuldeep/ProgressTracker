const express = require('express');
const router = express.Router();
const { getReflections, createReflection, deleteReflection } = require('../controllers/reflectionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getReflections)
  .post(createReflection);

router.route('/:id')
  .delete(deleteReflection);

module.exports = router;
