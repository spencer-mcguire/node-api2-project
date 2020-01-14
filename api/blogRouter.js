const express = require("express");

const Blogs = require("../data/db");

const router = express.Router();

//POST submit a post

router.post("/", (req, res) => {
	const { title, contents } = req.body;

	if (!title || !contents) {
		res.status(400).json({
			errorMessage: "Please provide title and contents for the post."
		});
	} else {
		Blogs.insert(req.body)
			.then(post => res.status(201).json(post))
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: "There was an error while saving the post to the database"
				});
			});
	}
});

// GET blog posts
router.get("/", (req, res) => {
	Blogs.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
