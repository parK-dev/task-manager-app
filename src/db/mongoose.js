import mongoose from 'mongoose';
import dotenv from 'dotenv/config';

const uri = process.env.DB.toString();
mongoose.set('useFindAndModify', false);
try {
  await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
} catch (e) {
  throw new Error(e);
};
