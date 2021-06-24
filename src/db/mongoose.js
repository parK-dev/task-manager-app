import mongoose from "mongoose";
import dotenv from 'dotenv/config';
import validator from "validator";

const uri = process.env.DB.toString();

try {
  await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
  const Task = mongoose.model('Task', {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    }
  });
  const task = new Task({
    description: 2,
    completed: false,
    email: 'test'
  });
  await task.save();

  const User = mongoose.model('User', {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('The email is not valid');
        };
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (validator.contains(value, 'password')) {
          throw new Error('The password cannot contain <password>');
        };
      }
    }
  });
  const newUser = new User ({
    username: 'park',
    email: 'park@park.com',
    password: 'this should work'
  });
  await newUser.save();
} catch (e) {
  console.error(e);
} finally {
  await mongoose.disconnect();
};

