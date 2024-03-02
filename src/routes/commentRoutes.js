// Path: src/routes/commentRoutes.js

const { Router } = require("express");

const { commentController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/comments"
const commentRouter = Router();

commentRouter.post("/post/:postId", authenticate.authenticate, commentController.addComment);

module.exports = commentRouter;
