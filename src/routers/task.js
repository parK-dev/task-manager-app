import express from 'express';
import Task from '../models/task.js';

const router = new express.Router();

// Task Routes

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) { return res.status(404).send(e) };
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e)
  }
});

router.patch('/tasks/:id', async(req, res) => {
  const updates = Object.keys(req.body);
  try {
    const task = await Task.findById(req.params.id);
    if (!task) { return res.status(404).send() };
    updates.forEach((update) => task[update] = req.body[update]);
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.delete('/tasks/:id', async(req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) { return res.status(404).send() };
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  };
});

export default router;