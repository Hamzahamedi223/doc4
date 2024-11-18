const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors())


const uri = 'mongodb://localhost:27017/mediaapp';
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
app.use('/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port`,process.env.PORT);
});