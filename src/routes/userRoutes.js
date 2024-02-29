// routes/userRoutes.js

const { Router } = require("express");
const { userController } = require("../controllers");

// "/users"
const userRouter = Router();

userRouter.post("/", userController.signupUser);
// userRouter.post("/login", userController.loginUser);
userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUser);
// userRouter.get("/:id/profile", userController.getUserProfile);
// userRouter.put("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
