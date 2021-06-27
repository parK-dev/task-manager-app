import mongoose from 'mongoose';
import validator from "validator";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
    minlength: 6,
    validate(value) {
      if (validator.contains(value, 'password')) {
        throw new Error('The password cannot contain <password>');
      };
    }
  }
});

// Password Hashing
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  };
  next(); // exits the function
});

const User = mongoose.model('User', userSchema);

export default User