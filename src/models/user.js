import mongoose from "mongoose";
import validator from "validator";

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
    minlength: 6,
    validate(value) {
      if (validator.contains(value, 'password')) {
        throw new Error('The password cannot contain <password>');
      };
    }
  }
});

export default User