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
  };
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    res.send(user);
  } catch (e) {
    
  };
});

router.patch('/users/:id', async(req, res) => {
  const updates = Object.keys(req.body);
  try {
    const user = await User.findById(req.params.id);
    if (!user) { return res.status(404).send() };
    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();
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