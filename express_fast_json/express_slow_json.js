import express from 'express';
import { MongoClient } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mydatabase';

const options = {
  "maxPoolSize" : 120
}

const client = new MongoClient(url, options);

try {
  client.connect();

} catch (err) {
  console.log(err);
}
// Select the database
const db = client.db(dbName);

// Get the person collection
const collection = db.collection('person');



// Create an Express app
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Route to save a person
app.get('/persons', async (req, res) => {
  try {
    const gender = req.query.gender;

    const person = await collection.findOne({ gender: gender }, { limit: 1 });
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } 
});

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});