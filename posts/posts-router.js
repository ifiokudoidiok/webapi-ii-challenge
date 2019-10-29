const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/", postUser);
router.get("/", getAllPosts);

function postUser(req, res) {
 
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    return res.status(400).json({
      success: false,
      errorMessage: "Please provide title and contents for the post"
    });
  }
  db.insert(newPost)
    .then(post => {
      db.findById(post.id).then(user => {
        res.status(200).json({
          success: true,
          user
        });
      });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        error,
        errorMessage: "There was an error while saving the post to the database"
      });
    });
}

function getAllPosts(req, res) {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        error: "The post information could not be retireved" + " " + error
      });
    });
}

module.exports = router;
