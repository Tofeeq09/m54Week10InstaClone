// Path: src/controllers/repostController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

const getReposts = async (req, res) => {
  try {
    const { handle } = req.params;

    const user = await User.findOne({ handle: handle });
    const reposts = await Repost.find({ user: user._id }).populate("post").sort({ createdAt: -1 });

    if (reposts.length === 0) {
      reposts = "No reposts";
    }

    res.status(200).send(reposts);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Invalid user handle" });
    }

    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
