const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load user model
const User = mongoose.model('users');

module.exports = (passport) => {
	passport.use(
		new GoogleStrategy({
			clientID: keys.googleClient_id,
			clientSecret:keys.googleclient_secret,
			callbackURL:'/auth/google/callback',
			proxy: true
		}, (accessToken, refreschToken, profile, done) => {
			const img = profile.photos[0].value.substring(0,
				profile.photos[0].value.indexOf('?'));

			const newUser = {
				googleID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				email: profile.emails[0].value,
				image: img
			};

			User.findOne({
				googleID: profile.id
			}).then( user => {
				if (user) {
					done(null, user);
				} else {
					new User(newUser)
						.save()
						.then(user => null, user)
				}
			})
			// console.log(accessToken);
			// console.log(profile);
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => done(null, user));
	});
};