// Path: src/routes/userRoutes.js

const { Router } = require("express");
const { userController } = require("../controllers");
const { authenticate } = require("../middleware");
const { validation } = require("../middleware");

// "/users"
const userRouter = Router();

// POST routes
userRouter.post("/signup", userController.signup); // Route for user signup
userRouter.post("/login", userController.login); // Route for user login
userRouter.post("/logout", authenticate.authenticate, userController.logout); // Route for user logout

// GET routes
userRouter.get("/", userController.getUsers); // Route for getting all users
userRouter.get("/:handle/private", authenticate.authenticate, userController.getPrivate); // Route for getting private user data
userRouter.get("/:handle", userController.getUser); // Route for getting a user by handle

// PUT routes
userRouter.put("/:handle", authenticate.authenticate, validation.checkPasswordChanged, userController.updateUser); // Route for updating a user
userRouter.put("/:handle/follow", authenticate.authenticate, userController.followUser); // Route for following a user
userRouter.put("/:handle/unfollow", authenticate.authenticate, userController.unfollowUser); // Route for unfollowing a user

// DELETE routes
userRouter.delete("/:handle", authenticate.authenticate, userController.deleteUser); // Route for deleting a user

module.exports = userRouter;
