// routes // userRoutes.js

const { Router } = require("express");
const { userController } = require("../controllers");

const userRouter = Router();

userRouter.post("/signup", userController.signupUser);
// userRouter.post("/login", userController.loginUser);
// userRouter.get("/users/:id", userController.getUser);
// userRouter.get("/users/:id/profile", userController.getUserProfile);
// userRouter.put("/users/:id", userController.updateUser);
// userRouter.delete("/users/:id", userController.deleteUser);

module.exports = userRouter;
