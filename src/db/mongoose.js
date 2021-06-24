import mongoose from "mongoose";
import dotenv from "dotenv/config";

const uri = process.env.DB.toString();

try {
  await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
  console.log('Connection successful');
} catch (e) {
  throw new Error(e);
};
