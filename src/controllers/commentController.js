// Path: src/controllers/commentController.js

const { User, Like, Repost, Comment, Bookmark, Post, Follow } = require("../models");

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.create({
      user: userId,
      post: postId,
      content: content,
    });

    res.status(200).json({ message: "Comment added successfully", comment: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
