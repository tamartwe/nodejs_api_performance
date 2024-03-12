// Import necessary libraries
import express from 'express';
import mongoose from 'mongoose';

// Create an Express application
const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost/mydatabase');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a Mongoose schema for the person object
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String
});

const Person = mongoose.model('Person', personSchema);

// Middleware to parse JSON request body
app.use(express.json());


// Define a GET route to find a person by gender
app.get('/persons', async (req, res) => {
    try {
        const gender = req.query.gender;
        const person = await Person.findOne({ gender: gender });
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.json(person);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/persons', async (req, res) => {
    try {
      // Extract person data from the request body
      const { name, age, gender } = req.body;
  
      // Create a new person document using the Person model
      const person = new Person({ name, age, gender });
  
      // Save the person to the database
      await person.save();
  
      res.status(201).json({ message: 'Person saved successfully' });
    } catch (error) {
      console.error('Error saving person:', error);
      res.status(500).json({ error: 'Error saving person' });
    }
  });

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});