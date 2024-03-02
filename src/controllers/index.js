// Path: src/controllers/index.js

const userController = require("./userController");
const postController = require("./postController");
const commentController = require("./commentController");
const conversationController = require("./conversationController");
// const messageController = require("./messageController");

module.exports = {
  userController,
  postController,
  commentController,
  conversationController,
  //   messageController,
};
