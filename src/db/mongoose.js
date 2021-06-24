import mongoose from "mongoose";
import dotenv from 'dotenv/config';

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
    }
  });
  const task = new Task({
    description: 2,
    completed: false
  });
  await task.save();
} catch (e) {
  console.error(e);
} finally {
  await mongoose.disconnect();
};

