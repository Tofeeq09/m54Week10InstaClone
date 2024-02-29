// Path: src/models/index.js

const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Message = require("./Message");
const Like = require("./Like");
const Repost = require("./Repost");
const Bookmark = require("./Bookmark");
const Follow = require("./Follow");

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
