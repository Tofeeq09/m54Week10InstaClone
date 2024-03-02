// Path: src/models/index.js

const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");
const Message = require("./message");
const Like = require("./like");
const Repost = require("./repost");
const Bookmark = require("./bookmark");
const Follow = require("./follow");

module.exports = {
  User,
  Post,
  Comment,
  Message,
  Like,
  Repost,
  Bookmark,
  Follow,
};
