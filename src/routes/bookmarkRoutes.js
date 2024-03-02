// Path: src/routes/bookmarkRoutes.js

const { Router } = require("express");
const { bookmarkController } = require("../controllers");

// "/bookmarks"
const bookmarkRouter = Router();

bookmarkRouter.get("/:id", bookmarkController.getUser);
