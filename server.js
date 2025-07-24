require('dotenv').config(); // 👈 NEW LINE

const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());
let feedbackData = [
  {
    id: '1',
    name: 'Ratan Singh Madrecha',
    email: 'ratan.singh@gmail.com',
    message: 'This is a great feedback tracker!',
    votes: 5,
  },
  {
    id: '2',
    name: 'Aanchal Mehta',
    email: 'aanchal.mehta@yahoo.com',
    message: 'I really like the simplicity of this app.',
    votes: 3,
  },
];
app.get('/feedback', (req, res) => {
  res.json(feedbackData);
});
app.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newFeedback = {
    id: Date.now().toString(),
    name,
    email,
    message,
    votes: 0,
  };

  feedbackData.push(newFeedback);
  res.status(201).json(newFeedback);
});
app.put('/feedback/:id/vote', (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'upvote' or 'downvote'

  const feedback = feedbackData.find((item) => item.id === id);

  if (!feedback) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  if (action === 'upvote') {
    feedback.votes++;
  } else if (action === 'downvote') {
    feedback.votes--;
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }

  res.json(feedback);
});
app.delete('/feedback/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = feedbackData.length;
  feedbackData = feedbackData.filter((item) => item.id !== id);

  if (feedbackData.length === initialLength) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});