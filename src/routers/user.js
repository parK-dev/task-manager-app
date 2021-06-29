import express from 'express';
import User from '../models/user.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import sharp from 'sharp';
import { sendWelcomeEmail, sendCancellationEmail } from '../emails/account.js';

const router = new express.Router();
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('File must be an image'));
    };
  }
});

// User Routes

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    sendWelcomeEmail(user.email, user.username);
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

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) { throw new Error() };
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  };
});

router.post ('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.status(200).send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.delete ('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  };
});

router.patch('/users/me', auth, async(req, res) => {
  const updates = Object.keys(req.body);
  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  };
});

router.delete('/users/me', auth, async(req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.username);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  };
});


export default router;