// Path: src/controllers/commentController.js

const { User, Post, Comment, Message } = require("../models");
const buildCommentTree = require("../utils/commentUtils");

exports.addComment = async (req, res) => {
  try {
    const { postId, parentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.create({
      user: userId,
      post: postId,
      parent: parentId || null,
      content: content,
    });

    console.log(`Comment added successfully: ${comment}`);
    res.status(200).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate("user", "handle name profilePhoto").populate("post");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const allComments = await Comment.find({ post: comment.post._id })
      .populate("user", "handle name profilePhoto")
      .sort({ votes: -1 });

    const commentTree = buildCommentTree(allComments);

    res.status(200).json({ comment, commentTree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true }).populate(
      "user",
      "handle name profilePhoto"
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
