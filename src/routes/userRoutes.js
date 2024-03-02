// Path: src/routes/userRoutes.js

const { Router } = require("express");

const { userController } = require("../controllers");
const { authenticate } = require("../middleware");
const { validation } = require("../middleware");

// "/users"
const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.post("/logout", authenticate.authenticate, userController.logout);
userRouter.post("/signup", userController.signup);
userRouter.get("/", userController.getUsers);
userRouter.get("/:handle", userController.getUser);
userRouter.get("/:handle/private", authenticate.authenticate, userController.getPrivate);
userRouter.put("/:handle", authenticate.authenticate, validation.checkPasswordChanged, userController.updateUser);
userRouter.delete("/:handle", authenticate.authenticate, userController.deleteUser);

module.exports = userRouter;
