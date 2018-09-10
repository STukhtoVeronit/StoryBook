const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Passport config
require('./config/passport')(passport);

// Load rotes
const auth = require('./routes/auth');

app.use('/auth', auth);

app.get('/', (req, res) => {
	res.send('test');
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('Server started on port: ' + port);
});
