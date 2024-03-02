// Path: src/models/Repost.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Repost schema
const repostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  timestamp: { type: Date, default: Date.now },
});

const Repost = mongoose.model("Repost", repostSchema);

module.exports = Repost;
