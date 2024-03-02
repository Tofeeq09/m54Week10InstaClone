// Path: src/routes/postRoutes.js

const { Router } = require("express");

const { postController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/posts"
const postRouter = Router();

postRouter.post("/user/:handle", authenticate.authenticate, postController.addPost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/user/:handle", postController.getPostsByHandle);
postRouter.get("/:postId", postController.getPost);
postRouter.put("/:postId", authenticate.authenticate, postController.updatePost);
postRouter.delete("/:postId", authenticate.authenticate, postController.deletePost);

module.exports = postRouter;
