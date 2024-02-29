// models/Comment.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Comment schema
const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // user is mandatory
  },
  content: {
    type: String,
    required: true, // content is mandatory
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true, // post is mandatory
  },
  timestamp: {
    type: Date,
    default: Date.now, // timestamp is automatically generated
  },
});

// Comment middleware
commentSchema.post("save", async function (doc) {
  const Post = mongoose.model("Post");
  await Post.findByIdAndUpdate(doc.post, { $push: { comments: doc._id } });
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
