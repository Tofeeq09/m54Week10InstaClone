// Path: src/routes/index.js

const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");
const conversationRoutes = require("./conversationRoutes");
// const messageRoutes = require("./messageRoutes");

module.exports = {
  userRoutes,
  postRoutes,
  commentRoutes,
  conversationRoutes,
  // messageRoutes,
};
