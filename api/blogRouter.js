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
      .then(post => {
        db.findById(post.id).then(data => {
          res.status(201).json(data);
        });
      })
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
  if (req.body.text) {
    db.insertComment(req.body).then(comment => {
      if (comment.id) {
        db.findCommentById(comment.id)
          .then(com => {
            res.status(201).json(com);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

// GET all blog posts

router.get("/", (req, res) => {
  db.find(req.query)
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
      if (posts.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        res.status(200).json(posts);
      }
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
      comment.length ? res.status(200).json(comment) : res.status(404);
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
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        db.remove(req.params.id)
          .then(deleted => {
            res.status(200).json(post);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        res
          .status(404)
          .json({ error: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved" });
    });
});

// PUT update a post

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!req.params.id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.update(req.params.id, req.body)
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

module.exports = router;
