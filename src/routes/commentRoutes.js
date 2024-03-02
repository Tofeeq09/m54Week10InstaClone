// Path: src/routes/commentRoutes.js

const { Router } = require("express");

const { commentController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/comments"
const commentRouter = Router();

// POST routes
commentRouter.post("/post/:postId/:parentId?", authenticate.authenticate, commentController.addComment);

// GET routes
commentRouter.get("/:commentId", commentController.getComment);

// PUT routes
commentRouter.put("/:commentId", authenticate.authenticate, commentController.editComment);

// DELETE routes
commentRouter.delete("/:commentId", authenticate.authenticate, commentController.deleteComment);

module.exports = commentRouter;
