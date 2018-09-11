const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

const passport = require('passport');

const app = express();

// Loads keys
const keys = require('./config/keys');

// Mongoose promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI, {
	useMongoClient: true
})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error(err));

// Load MongoDB's models
require('./models/User');

// Passport config
require('./config/passport')(passport);

//Handlebars middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Middleware
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

// Load rotes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Use Routes
app.use('/', index);
app.use('/auth', auth);


const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('Server started on port: ' + port);
});
