const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
	Post.findAll({
		attributes: [
			'id',
			'post_url',
			'title',
			'created_at',
			[
				sequelize.literal(
					'(SELECT COUNT(*) FROM vote WHERE vote.post_id = post.id)'
				),
				'vote_count',
			],
		],
		include: [
			{
				model: Comment,
				attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
				include: {
					model: User,
					attributes: ['username'],
				},
			},
			{
				model: User,
				attributes: ['username'],
			},
		],
	})
		.then((dbPostData) => {
			// serialize the entire array of posts
			const posts = dbPostData.map((post) => post.get({ plain: true }));
			res.render('homepage', { posts });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
