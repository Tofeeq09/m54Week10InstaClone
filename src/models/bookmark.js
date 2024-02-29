const mongoose = require("mongoose");
const { Schema } = mongoose;

// Bookmark schema
const bookmarkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add a unique compound index on user and post
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
