// Path: src/routes/postRoutes.js

const { Router } = require("express");

const { postController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/posts"
const postRouter = Router();

// POST routes
postRouter.post("/user/:handle", authenticate.authenticate, postController.addPost); // Route for adding a post
postRouter.post("/:postId/like", authenticate.authenticate, postController.likePost); // Route for liking a post
postRouter.post("/:postId/unlike", authenticate.authenticate, postController.unlikePost); // Route for unliking a post
postRouter.post("/:postId/repost", authenticate.authenticate, postController.repostPost); // Route for reposting a post
postRouter.post("/:postId/unrepost", authenticate.authenticate, postController.unrepostPost); // Route for unreposting a post
postRouter.post("/:postId/bookmark", authenticate.authenticate, postController.bookmarkPost); // Route for bookmarking a post
postRouter.post("/:postId/unbookmark", authenticate.authenticate, postController.unbookmarkPost); // Route for unbookmarking a post

// GET routes
postRouter.get("/", postController.getAllPosts); // Route for getting all posts
postRouter.get("/user/:handle", postController.getPostsByHandle); // Route for getting posts by a user's handle
postRouter.get("/:postId", postController.getPost); // Route for getting a post by its ID

// PUT routes
postRouter.put("/:postId", authenticate.authenticate, postController.updatePost); // Route for updating a post

// DELETE routes
postRouter.delete("/:postId", authenticate.authenticate, postController.deletePost); // Route for deleting a post

module.exports = postRouter;
