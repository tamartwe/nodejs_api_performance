import express from 'express';
import { MongoClient } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mydatabase';


const client = new MongoClient(url);

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
app.post('/persons', async (req, res) => {
  try {
    // Extract person data from the request body
    const { name, age, gender } = req.body;

    // Create a new person document using the Person model
    const person = {
      name: name,
      age: age,
      gender: gender
    };

    // Insert the person document
    const result = await collection.insertOne(person);
    res.status(201).json({ message: 'Person saved successfully' });
  } catch (error) {
    console.error('Error saving person:', error);
    res.status(500).json({ error: 'Error saving person' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});