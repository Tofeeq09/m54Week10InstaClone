// Path: src/controllers/messageController.js

const { User, Post, Comment, Message } = require("../models");

exports.postMessage = async (req, res) => {
  try {
    const { id } = req.user;
    const { message } = req.body;
    const newMessage = await Message.create({ message, userId: id });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
