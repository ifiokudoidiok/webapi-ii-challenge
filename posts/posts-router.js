const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get("/", getAllPosts)

function getAllPosts(req, res) {
 db.find()
  .then(posts => {
      res.status(200).json(posts)
  })
  .catch(error => {
      res.status(500).json({
          success:false,
          error: "The post information could not be retireved"
      })
  })
}


module.exports = router;