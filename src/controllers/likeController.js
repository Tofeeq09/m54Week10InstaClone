// Path: src/controllers/likeController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

exports.getLikes = async (req, res) => {
  try {
    const { handle } = req.params;

    const user = await User.findOne({ handle: handle });
    let likes = await Like.find({ user: user._id }).populate("post").sort({ createdAt: -1 });

    if (likes.length === 0) {
      likes = "No likes";
    }

    res.status(200).send(likes);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Invalid user handle" });
    }

    console.log(error);
    res.status(400).send({ message: error.message });
  }
};
