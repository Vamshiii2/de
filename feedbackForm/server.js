const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

// Middleware to parse JSON in the request body
app.use(express.json()); 


// MongoDB connection
mongoose.connect('mongodb+srv://gangamma:gangamma@cluster0.wmqmtjl.mongodb.net/?retryWrites=true&w=majority');

// Feedback model
const Feedback = mongoose.model('Feedback', {
  name: String,
  email: String,
  feedback: String,
});



// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// API endpoint to submit feedback
app.post('/submit-feedback', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    if (!name || !email || !feedback) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Create a new feedback instance
    const newFeedback = new Feedback({
      name,
      email,
      feedback,
    });

    // Save the feedback to MongoDB
    await newFeedback.save();

    res.json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
