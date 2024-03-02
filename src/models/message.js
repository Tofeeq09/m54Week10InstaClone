// Path: src/models/message.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Message schema
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

messageSchema.index({ content: "text" });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
