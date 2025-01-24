const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // maximum number of requests allowed in the windowMs
  message: {
    status: false,
    message: 'Too many requests, please try again later.'
  },
});

const main = require('./controller/mainController');
const datamock = require('./controller/mockController');
const chatai = require('./controller/chatController');

const app = express();
const PORT = process.env.PORT || 5999;

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../clientapp/dist')));

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use('/api/*', limiter);
app.use('/api/*', cors());

// API routes
app.use('/api', main);
app.use('/api/mock', datamock);
app.use('/api/chat', chatai);


// Serve React frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../clientapp/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
