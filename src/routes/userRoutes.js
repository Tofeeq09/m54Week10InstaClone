// Path: src/routes/userRoutes.js

const { Router } = require("express");

const { userController } = require("../controllers");
const { authenticate } = require("../middleware");
const { validation } = require("../middleware");

// "/users"
const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.post("/signup", userController.signup);
userRouter.get("/", userController.getUsers);
userRouter.get("/:handle", authenticate.authenticate, userController.getUser);
// userRouter.get("/:handle/profile", authenticate.authenticate, userController.getUserProfile);
userRouter.put("/:handle", authenticate.authenticate, validation.checkPasswordChanged, userController.updateUser);
userRouter.delete("/:handle", authenticate.authenticate, userController.deleteUser);

module.exports = userRouter;
