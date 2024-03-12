import express from 'express';
import { MongoClient } from 'mongodb';
import fastJson from 'fast-json-stringify';

const stringify = fastJson({
  title: 'Person',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    age: {
      description: 'Age in years',
      type: 'integer'
    }
  }
})

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

// Custom JSON serialization middleware
const customJsonMiddleware = (req, res, next) => {
  // Override the res.json() method with custom serialization logic
  res.json = function(data) {
    const jsonData = stringify(data); // Custom serialization logic
    res.setHeader('Content-Type', 'application/json');
    res.end(jsonData);
  };

  // Call the next middleware or route handler
  next();
};

// Use the custom JSON serialization middleware for all routes
app.use(customJsonMiddleware);

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