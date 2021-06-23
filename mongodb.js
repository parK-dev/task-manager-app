import mongodb from 'mongodb';
import dotenv from 'dotenv/config';

const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://parkdev:${process.env.DB}@cluster0.f5zgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'taskManagerDB';



client.connect(err => {
  if (err) {
    return console.error(err);
  };
  console.log('Connected successfully.');
  const task = {title: 'Figure it out', date: 'today'};
  const collection = client.db(dbName).collection("Tasks");
  collection.insertOne(task, (err, res) =>{
    if (err) {
      return console.error(err);
    };
    client.close();
  }); 
});

