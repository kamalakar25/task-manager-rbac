const express = require('express');
const auth = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.use(auth()); // require authentication for all task routes

router.route('/').post(createTask).get(getTasks);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;


