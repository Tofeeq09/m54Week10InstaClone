// Path: src/models/Message.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Message schema
const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // sender is mandatory
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // receiver is mandatory
  },
  content: {
    type: String,
    required: true, // content is mandatory
  },
  timestamp: {
    type: Date,
    default: Date.now, // timestamp is automatically generated
  },
});

messageSchema.index({ content: "text" });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
