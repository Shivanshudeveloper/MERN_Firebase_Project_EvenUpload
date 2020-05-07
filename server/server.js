const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');

// Route Files
const readwrite = require('./routes/readwrite');

// DB Connection
const db = require('./config/keys').MongoURI;
// Connect MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log('MongoDB Connected') )
    .catch(err => console.log(err));



const app = express();

app.use(express.json());

// Routing for API Service
app.use('/api/v1/readwrite', readwrite);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));