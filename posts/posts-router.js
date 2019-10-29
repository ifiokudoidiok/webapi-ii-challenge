const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/", postUser);
router.get("/", getAllPosts);
router.delete("/:id", deletePost);
router.get("/:id", getPostById);
router.put("/:id", editPost);

router.get("/:id/comments", getComments);

function getComments(req, res) {
  const { id } = req.params;
  db.findPostComments(id)
  .then(comments => {
    if((!comments) || (comments.length === 0)){
      res.status(400).json({
        message: "The post with the specified ID does not exist"
      })
    }else{
      res.status(200).json(comments)
    }
  })
  .catch(error => {
    res.status(500).json({
      error: "The comment information could not be retrieved" + " " + error
    })
  })
}

function editPost(req, res) {
  const { id } = req.params;
  const editedVersion = req.body;

  db.update(id, editedVersion).then(edit => {
    if(edit){
      if(editedVersion.title && editedVersion.contents){
        db.findById(id).then(post => {
          res.status(200).json({
            post
          })
        })
      }else{
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post"
        })
      }
    }else{
      res.status(404).json({
        message: "The post with the specified ID does not exist"
      })
    }
  }).catch(error => {
    res.status(500).json({
      success:false,
      error: "The post information could not be modified" + " " + error
    })
  })

}

function getPostById(req, res) {
  const { id } = req.params
  db.findById(id)
      .then(post => {
          if (post.length < 1) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
          }
          else {
             
              res.status(200).json(post)
          }
      })
      .catch(error => {
          res.status(500).json({ error: "The posts information could not be retrieved." + " " + error })
      })
}

function deletePost(req, res) {
  const id = req.params.id;
  db.remove(id)
    .then(deletedPost => {
      if (deletedPost) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message:  "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        error: "The post could not be removed" + " " + error
      });
    })
}

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
