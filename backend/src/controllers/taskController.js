const Joi = require('joi');
const Task = require('../models/Task');

const baseTaskSchema = Joi.object({
  title: Joi.string().max(120).required(),
  description: Joi.string().allow('', null).max(1000),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
});

const createTaskSchema = baseTaskSchema;
const updateTaskSchema = baseTaskSchema.fork(['title'], (schema) => schema.optional()).min(1);

exports.createTask = async (req, res) => {
  try {
    const { value, error } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.create({
      ...value,
      createdBy: req.user.id,
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const query = {};

    if (req.user.role !== 'admin') {
      query.createdBy = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Task.countDocuments(query);

    return res.json({
      tasks,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email role');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { value, error } = updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(task, value);
    await task.save();

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await task.deleteOne();
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


