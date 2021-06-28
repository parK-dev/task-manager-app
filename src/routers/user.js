import express from 'express';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = new express.Router();

// User Routes

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  };
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  };
});

router.post ('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  };
});

router.post ('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  };
});

router.patch('/users/:id', auth, async(req, res) => {
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

router.delete('/users/:id', auth, async(req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params);
    if (!user) { return res.status(404).send() };
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  };
});


export default router;