// Path: src/routes/commentRoutes.js

const { Router } = require("express");

const { commentController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/comments"
const commentRouter = Router();

commentRouter.post("/post/:postId", authenticate.authenticate, commentController.addComment);

commentRouter.get("/:commentId", commentController.getComment);

commentRouter.put("/:commentId", authenticate.authenticate, commentController.updateComment);

commentRouter.delete("/:commentId", authenticate.authenticate, commentController.deleteComment);

module.exports = commentRouter;
