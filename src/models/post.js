// models /Post.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Content schema
const contentSchema = new Schema({
  caption: {
    type: String,
  },
  postImage: {
    type: String,
    required: true, // postImage is mandatory
    validate: {
      validator: function (v) {
        // postImage must follow a valid URL format if storing URL to external service
        return /^https?:\/\/.+/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

// Post schema
const postSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // creator is mandatory
  },
  content: {
    // embed the content subdocument
    type: contentSchema,
    required: true, // content is mandatory
  },
  timestamp: {
    type: Date,
    default: Date.now, // timestamp is automatically generated
    index: true, // timestamp is indexed for performance
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
