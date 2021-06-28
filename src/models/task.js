import mongoose from 'mongoose';

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
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

export default Task