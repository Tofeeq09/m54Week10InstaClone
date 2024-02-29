// Path: src/controllers/bookmarkController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

const getBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const bookmarks = await Bookmark.find({ user: userId }).populate("post");
    res.status(200).json({ user, bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
