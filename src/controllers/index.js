// Path: src/controllers/index.js

const userController = require("./userController");
const postController = require("./postController");
const commentController = require("./commentController");
// const messageController = require("./messageController");

module.exports = {
  userController,
  postController,
  commentController,
  //   messageController,
};
