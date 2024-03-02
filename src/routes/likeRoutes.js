// Path: src/routes/likeRoutes.js

const { Router } = require("express");
const { likeController } = require("../controllers");

// "/follows"

const likeRouter = Router();

likeRouter.get("/:handle", likeController.getLikes);

module.exports = likeRouter;
