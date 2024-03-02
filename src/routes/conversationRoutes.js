// Path: src/routes/conversationRoutes.js

const { Router } = require("express");

const { conversationController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/conversations"
const conversationRouter = Router();

// POST routes
conversationRouter.post("/", authenticate.authenticate, conversationController.startConversation); // Route for starting a conversation
conversationRouter.post("/:userId/message", authenticate.authenticate, conversationController.sendMessage); // Route for sending a message

// GET routes
conversationRouter.get("/", authenticate.authenticate, conversationController.getAllConversations); // Route for getting all conversations of the authenticated user
conversationRouter.get("/:id", authenticate.authenticate, conversationController.getConversation); // Route for getting a single conversation by its ID

module.exports = conversationRouter;
