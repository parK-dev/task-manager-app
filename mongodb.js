import mongodb from 'mongodb';
import dotenv from 'dotenv/config';

const MongoClient = mongodb.MongoClient;

const uri = process.env.DB.toString();
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('taskManagerDB');
    const collection = database.collection('Tasks');
    const found = await collection.deleteOne({
      description:"Figure out Async/Await"
    });
    console.log(found);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

run().catch(console.dir);
