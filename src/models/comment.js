// Path: src/models/Comment.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Comment schema
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

// Comment middleware
commentSchema.post("save", async function (doc) {
  const Post = mongoose.model("Post");
  await Post.findByIdAndUpdate(doc.post, { $push: { comments: doc._id } });
});

commentSchema.index({ content: "text" });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
