// Path: src/routes/userRoutes.js

const { Router } = require("express");
const { userController } = require("../controllers");

// "/users"
const userRouter = Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getUsers);
userRouter.get("/:handle", userController.getUser);
// userRouter.get("/:handle/profile", userController.getUserProfile);
// userRouter.put("/:handle", userController.updateUser);
// userRouter.delete("/:handle", userController.deleteUser);

module.exports = userRouter;
