// Path: src/controllers/userController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

exports.signupUser = async (req, res) => {
  try {
    const { name, handle, email, password } = req.body;

    const user = new User({ name, handle, email, password });
    await user.save();
    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    res.status(201).send({ rest });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const searchQuery = (req.query.search || "").trim();
    let query = {};
    if (searchQuery !== "") {
      query = {
        $or: [{ name: { $regex: searchQuery, $options: "i" } }, { handle: { $regex: searchQuery, $options: "i" } }],
      };
    }

    const users = await User.find(query).select("-password -__v -email");

    res.status(200).send({ users });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// exports.loginUser = async (req, res) => {};

exports.getUser = async (req, res) => {
  try {
    const { handle } = req.params;

    const user = await User.findOne({ handle: handle });
    let likes = await Like.find({ user: user._id }).populate("post");
    let reposts = await Repost.find({ user: user._id }).populate("post");
    let bookmarks = await Bookmark.find({ user: user._id }).populate("post");
    let posts = await Post.find({ creator: user._id });
    let following = await Follow.find({ user: user._id }).populate("followedUser");
    let followers = await Follow.find({ followedUser: user._id }).populate("user");

    if (likes.length === 0) {
      likes = "No likes";
    }

    if (reposts.length === 0) {
      reposts = "No reposts";
    }

    if (bookmarks.length === 0) {
      bookmarks = "No bookmarks";
    }

    if (posts.length === 0) {
      posts = "No posts";
    }

    if (following.length === 0) {
      following = "No following";
    }

    if (followers.length === 0) {
      followers = "No followers";
    }

    const { password, __v, email, ...rest } = user._doc;
    const result = {
      ...rest,
      likes,
      reposts,
      bookmarks,
      posts,
      following,
      followers,
    };

    res.status(200).send(result);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Invalid user handle" });
    }

    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// exports.updateUser = async (req, res) => {};

// exports.deleteUser = async (req, res) => {};
