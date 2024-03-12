import express from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const secretKey = 'your-secret-key';

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

// Middleware to parse the JWT token from the request
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      // Verify and decode the JWT token
      const decodedToken = jwt.verify(token, secretKey);

      // Attach the decoded token to the request object
      req.decodedToken = decodedToken;
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  next();
});

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

// Generate and sign a JWT
app.get('/generateToken', (req, res) => {
  // Assuming we have a user ID to embed in the token
  const userId = 123;

  // Create the token using user ID and secret key
  const token = jwt.sign({ userId }, secretKey);

  res.json({ token });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});