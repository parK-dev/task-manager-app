import mongoose from 'mongoose';
import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';
import Task from './task';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
    minlength: 6,
    validate(value) {
      if (validator.contains(value, 'password')) {
        throw new Error('The password cannot contain <password>');
      };
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

// AuthToken Generator
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, 'iamlostinthewoods');
  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

// Login method
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) { throw new Error('Unable to login') };
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) { throw new Error('Unable to login') };
  return user;
};

// Password Hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  };
  next(); // exits the function
});

const User = mongoose.model('User', userSchema);

export default User