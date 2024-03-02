// Path: src/controllers/conversationController.js

const { Conversation, Message } = require("../models");

exports.startConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    // Check if a conversation already exists between the two users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    });

    if (conversation) {
      res.status(400).json({ message: "Conversation already exists" });
      return;
    }

    // Create a new conversation
    conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
    });

    // Populate the participants field in the conversation
    await conversation
      .populate({
        path: "participants",
        select: "name handle profilePhoto",
      })
      .execPopulate();

    res.status(201).json({ message: "Conversation started", conversation });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    // Find the conversation between the two users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    // Create a new message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    // Add the message to the conversation
    conversation.messages.push(message._id);
    await conversation.save();

    // Populate the sender and receiver fields in the message
    await message
      .populate({
        path: "sender receiver",
        select: "name handle profilePhoto",
      })
      .execPopulate();

    res.status(201).json({ message: "Message sent", message });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    // Find all conversations that include the authenticated user
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate({
        path: "participants",
        select: "name handle profilePhoto",
      })
      .populate({
        path: "messages",
        populate: {
          path: "sender receiver",
          select: "name handle profilePhoto",
        },
      });

    res.status(200).json({ conversations });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the conversation by its ID
    const conversation = await Conversation.findById(id)
      .populate({
        path: "participants",
        select: "name handle profilePhoto",
      })
      .populate({
        path: "messages",
        populate: {
          path: "sender receiver",
          select: "name handle profilePhoto",
        },
      });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    res.status(200).json({ conversation });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};
