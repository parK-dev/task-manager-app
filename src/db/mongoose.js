import mongoose from "mongoose";
import dotenv from 'dotenv/config';
import validator from "validator";

const uri = process.env.DB.toString();

try {
  await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
  const Task = mongoose.model('Task', {
    description: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('The email is not valid')
        }
      }
    }
  });
  const task = new Task({
    description: 2,
    completed: false,
    email: 'test'
  });
  await task.save();
} catch (e) {
  console.error(e);
} finally {
  await mongoose.disconnect();
};

