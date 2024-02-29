// Path: src/models/Follow.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Follow schema
const followSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followedUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
