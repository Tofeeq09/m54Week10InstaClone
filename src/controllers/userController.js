// Path: src/controllers/userController.js

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

exports.signup = async (req, res) => {
  try {
    const { name, handle, email, password } = req.body;

    const existingEmailUser = await User.findOne({ email });
    const existingHandleUser = await User.findOne({ handle });

    if (existingEmailUser && existingHandleUser) {
      return res.status(400).send({ message: "Both email and handle already exist" });
    } else if (existingEmailUser) {
      return res.status(400).send({ message: "Email already exists" });
    } else if (existingHandleUser) {
      return res.status(400).send({ message: "Handle already exists" });
    }

    // The create() method is equivalent to instantiating a document with new Model() and then calling save() on it.
    const user = new User({ name, handle, email, password });
    await user.save(); // re('save') middleware defined in src/models/User.js runs before the save()

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

const jwt = require("jsonwebtoken");

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, handle, password } = req.body;

    if (!email && !handle) {
      return res.status(400).send({ message: "Email or handle is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }

    let user;

    if (email) {
      user = await User.findOne({ email });
    }

    if (!user && handle) {
      user = await User.findOne({ handle });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1h" });

    // Set a httpOnly cookie with the token
    res.cookie("token", token, { httpOnly: true });

    // Send the user data back to the client
    res.status(200).send({ user: rest });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// exports.getUser = async (req, res) => {
//   try {
//     const { handle } = req.params;

// const user = await User.findOne({ handle: handle }).select("-password -__v -email");

//     res.status(200).send(user);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).send({ message: "Invalid user handle" });
//     }

//     console.log(error);
//     res.status(400).send({ message: error.message });
//   }
// };

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
    res.status(500).send({ message: error.message });
  }
};

// exports.updateUser = async (req, res) => {};

// exports.deleteUser = async (req, res) => {};
