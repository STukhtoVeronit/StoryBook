const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');



const passport = require('passport');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override middleware
app.use(methodOverride('_method'));

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
require('./models/Story');

// Passport config
require('./config/passport')(passport);
// Handlebars helpers
const {
	truncate,
	stripTags,
	formatDate,
	select
} = require('./helpers/hbs');
//Handlebars middleware
app.engine('handlebars', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate,
		select: select
	},
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
const stories = require('./routes/stories');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);


const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('Server started on port: ' + port);
});
