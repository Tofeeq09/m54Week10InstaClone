// Path: src/controllers/messageController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

const postMessage = async (req, res) => {
  try {
    const { id } = req.user;
    const { message } = req.body;
    const newMessage = await Message.create({ message, userId: id });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
