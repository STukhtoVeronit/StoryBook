const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const UserShema = new Shema({
	googleID:{
		type:String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	image: {
		type: String
	}
});

mongoose.model('users', UserShema);
