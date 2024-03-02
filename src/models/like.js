// Path: src/models/Like.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Like schema
const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  timestamp: { type: Date, default: Date.now },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
