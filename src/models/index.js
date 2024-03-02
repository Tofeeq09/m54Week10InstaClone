// Path: src/models/index.js

const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");
const Conversation = require("./conversation");
const Message = require("./message");

module.exports = {
  User,
  Post,
  Comment,
  Conversation,
  Message,
};
