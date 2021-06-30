import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user';
import Task from '../../src/models/task';

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  username: 'user1',
  email: 'user1@user.com',
  password: '86theUzer!!',
  tokens: [{
    token: jwt.sign({ _id: user1Id }, process.env.TOKEN)
  }]
};

const user2Id = new mongoose.Types.ObjectId();
const user2 = {
  _id: user2Id,
  username: 'user2',
  email: 'user2@user.com',
  password: '86th345eUzer!!',
  tokens: [{
    token: jwt.sign({ _id: user2Id }, process.env.TOKEN)
  }]
};

const task1 = {
  _id: new mongoose.Types.ObjectId,
  description: 'seed task1',
  completed: false,
  userID: user1Id
};

const task2 = {
  _id: new mongoose.Types.ObjectId,
  description: 'seed task2',
  completed: false,
  userID: user1Id
};

const task3 = {
  _id: new mongoose.Types.ObjectId,
  description: 'seed task2',
  completed: false,
  userID: user2Id
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(user1).save();
  await new User(user2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

export { setupDatabase, user1, user1Id, user2, user2Id, task1, task2, task3 };