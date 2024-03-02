// Path: src/models/post.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Content schema
const contentSchema = new Schema({
  caption: { type: String },
  postImage: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

// Post schema
const postSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: contentSchema, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reposts: { type: Number, default: 0 },
  repostedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookmarks: { type: Number, default: 0 },
  bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  timestamp: { type: Date, default: Date.now, index: true },
});

// Add a text index to the caption field for full-text search
postSchema.index({ "content.caption": "text" });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
