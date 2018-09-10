const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = (passport) => {
	passport.use(
		new GoogleStrategy({
			clientID: keys.googleClient_id,
			clientSecret:keys.googleclient_secret,
			callbackURL:'/auth/google/callback',
			proxy: true
		}, (accessToken, refreschToken, profile, done) => {
			console.log(accessToken);
			console.log(profile);
		})
	)
};