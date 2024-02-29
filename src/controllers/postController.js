// Path: src/controllers/postController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");
exports.getPosts = async (req, res) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({
      where: { handle },
      attributes: ["id"],
      include: [
        {
          model: Post,
          as: "posts",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "handle", "avatar"],
            },
            {
              model: Like,
              as: "likes",
              attributes: ["id"],
            },
            {
              model: Repost,
              as: "reposts",
              attributes: ["id"],
            },
            {
              model: Bookmark,
              as: "bookmarks",
              attributes: ["id"],
            },
          ],
        },
      ],
    });

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
