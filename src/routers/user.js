import express from 'express';
import User from '../models/user.js';

const router = new express.Router();

// User Routes

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { return res.status(404).send() };
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/users/:id', async(req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) { return res.status(404).send() };
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.delete('/users/:id', async(req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params);
    if (!user) { return res.status(404).send() };
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  };
});


export default router;