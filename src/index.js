import express from "express";
import './db/mongoose.js';
import User from './models/user.js'
import Task from './models/task.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e)
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});