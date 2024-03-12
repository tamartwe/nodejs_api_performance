import express from 'express';
import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/persons_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a schema for a person
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String
});

// Create a model from the person schema
const Person = mongoose.model('Person', personSchema);

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
    const person = new Person({ name, age, gender });

    // Save the person to the database
    await person.save();

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