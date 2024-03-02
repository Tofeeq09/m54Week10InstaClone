// Path: src/controllers/index.js

const userController = require("./userController");
const postController = require("./postController");
const commentController = require("./commentController");
// const messageController = require("./messageController");
const likeController = require("./likeController");
// const repostController = require("./repostController");
// const bookmarkController = require("./bookmarkController");
// const followController = require("./followController");

module.exports = {
  userController,
  postController,
  commentController,
  //   messageController,
  likeController,
  //   repostController,
  //   bookmarkController,
  //   followController,
};
