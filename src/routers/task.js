import express from 'express';
import Task from '../models/task.js';
import auth from '../middleware/auth.js';

const router = new express.Router();

// Task Routes

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({_id, owner: req.user._id});
    if (!task) { return res.status(404).send(e) };
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userID: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e)
  }
});

router.patch('/tasks/:id', auth, async(req, res) => {
  const updates = Object.keys(req.body);
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) { return res.status(404).send() };
    updates.forEach((update) => task[update] = req.body[update]);
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.delete('/tasks/:id', auth, async(req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) { return res.status(404).send() };
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  };
});

export default router;