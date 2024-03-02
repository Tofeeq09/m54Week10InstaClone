// Path: src/models/conversation.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Conversation schema
const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
