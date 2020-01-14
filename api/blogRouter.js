const express = require("express");

const db = require("../data/db");

const router = express.Router();

//POST submit a post

router.post("/", (req, res) => {
	const { title, contents } = req.body;

	if (!title || !contents) {
		res.status(400).json({
			errorMessage: "Please provide title and contents for the post."
		});
	} else {
		db.insert(req.body)
			.then(post => res.status(201).json(post))
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: "There was an error while saving the post to the database"
				});
			});
	}
});

// POST a comment on a post

router.post("/:id/comments", (req, res) => {
	if (!req.body.text) {
		res
			.status(400)
			.json({ errorMessage: "Please provide text for the comment." });
	} else {
		db.insertComment(req.body)
			.then(comment => {
				res.status(201).json(comment);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: "There was an error while saving the comment to the database"
				});
			});
	}
});

// GET all blog posts

router.get("/", (req, res) => {
	db.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(err => {
			console.log(err);
			res
				.status(500)
				.json({ error: "The posts information could not be retrieved." });
		});
});

// GET post by ID

router.get("/:id", (req, res) => {
	db.findById(req.params.id)
		.then(posts => {
			posts
				? res.status(200).json(posts)
				: res.status(404).json({
						message: "The post with the specified ID does not exist."
				  });
		})
		.catch(err => {
			console.log(err);
			res
				.status(500)
				.json({ error: "The post information could not be retrieved." });
		});
});

// GET comments for a post

router.get("/:id/comments", (req, res) => {
	db.findPostComments(req.params.id)
		.then(comment => {
			comment ? res.status(200).json(comment) : res.status(404);
		})
		.catch(err => {
			console.log(err);
			res
				.status(500)
				.json({ error: "The comments information could not be retrieved." });
		});
});

// DELETE a post

router.delete("/:id", (req, res) => {
	!req.params.id
		? res
				.status(404)
				.json({ message: "The post with the specified ID does not exist." })
		: db
				.remove(req.params.id)
				.then(removed => res.status(200).json(removed))
				.catch(err => {
					console.log(err);
					res.status(500).json({ error: "The post could not be removed" });
				});
});

module.exports = router;
