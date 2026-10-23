const router = require('express').Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('lead', 'name')
      .populate('assignedTo', 'name');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE TASK
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user.id
    });
    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('lead', 'name')
      .populate('assignedTo', 'name');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, ...updateData } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    
    if (status && status !== task.status) {
      const assignedUserId = task.assignedTo ? task.assignedTo.toString() : null;
      
      
      if (!assignedUserId || assignedUserId !== req.user.id) {
        return res.status(403).json({ 
          error: 'Permission Denied: Only the assigned user can update this task status!' 
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { ...updateData, status }, 
      { new: true }
    ).populate('lead', 'name').populate('assignedTo', 'name');

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;