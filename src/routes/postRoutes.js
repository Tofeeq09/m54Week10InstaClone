// Path: src/routes/postRoutes.js

const { Router } = require("express");

const { postController } = require("../controllers");
const { authenticate } = require("../middleware");

// "/posts"
const postRouter = Router();

postRouter.post("/:handle", authenticate.authenticate, postController.addPost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/user/:handle", postController.getPostsByHandle);
postRouter.get("/:postId", postController.getPost);
// postRouter.delete("/:handle/post/:postId", postController.deletePost);

module.exports = postRouter;
