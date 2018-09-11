const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

router.get('/', (req, res) => {
	Story.find({status:'public'})
		.populate('user')
		.sort({data:'desc'})
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});
router.get('/user', (req, res) => {
	Story.find({user: req.user.id, status:'public'})
		.populate('user')
		.sort({data:'desc'})
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});
router.get('/user/:id', (req, res) => {
	Story.find({user: req.params.id, status:'public'})
		.populate('user')
		.sort({data:'desc'})
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

// Show Single Story
router.get('/show/:id', (req, res) => {
	Story.findOne({
			_id: req.params.id
		})
		.populate('user')
		.populate(`comments.commentUser`)
		.then(story => {
			res.render('stories/show', {
				story: story
			});
		});
});

router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
			_id: req.params.id,
			user: req.user.id
		})
		.populate('user')
		.then(story => {
			res.render('stories/edit', {
				story: story
			});
		});
});


router.post('/', ensureAuthenticated, (req, res) => {
	let allowComments;

	if (req.body.allowComments){
		allowComments = true;
	} else {
		allowComments = false;
	}

	const newStory = {
		title: req.body.title,
		body: req.body.body,
		status: req.body.status,
		allowComments:allowComments,
		user: req.user.id
	};

	// Create Story
	new Story(newStory)
		.save()
		.then(story => {
			res.redirect(`/stories/show/${story.id}`);
		});
});
router.post('/comments/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
		.then(story => {
			const newComment = {
				commentBody: req.body.commentBody,
				commentUser: req.user.id
			};

			story.comments.unshift(newComment);

			story.save()
				.then(story => {
					res.redirect(`/stories/show/${story.id}`);
				})
		})
});

router.put('/:id', (req, res) => {
	Story.findOne({
			_id: req.params.id
		})
		.then(story => {
			let allowComments;

			if (req.body.allowComments){
				allowComments = true;
			} else {
				allowComments = false;
			}

			story.title = req.body.title;
			story.body = req.body.body;
			story.status = req.body.status;
			story.allowComments = req.body.allowComments;

			story.save()
				.then(story => {
					res.redirect('/dashboard');
				});
		});
});

router.delete('/:id', (req, res) => {
	Story.remove({
		_id: req.params.id
	}).then(() => {
		res.redirect('/dashboard')
	})
});

module.exports = router;