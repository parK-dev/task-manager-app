import mongodb from 'mongodb';
import dotenv from 'dotenv/config';

const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://parkdev:${process.env.DB}@cluster0.f5zgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err) {
    return console.log(err);
  };
  console.log('Connected successfully.');
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
