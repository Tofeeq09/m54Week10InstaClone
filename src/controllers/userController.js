// Path: src/controllers/userController.js

const jwt = require("jsonwebtoken");

const { User, Like, Repost, Bookmark, Post, Follow } = require("../models");

exports.login = async (req, res) => {
  try {
    const { email, handle, password } = req.body;

    if (!email && !handle) {
      return res.status(400).send({ message: "Email or handle is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }

    const user = await User.findOne({
      $or: [{ email }, { handle }],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true });

    console.log(`res.get("Set-Cookie"): ${res.get("Set-Cookie")}`);

    // Send the user data back to the client
    res.status(200).send({ user: rest });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const errorField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `The ${errorField} you entered is already in use` });
    }
    res.status(500).send({ message: error.message });
  }
};

exports.logout = (req, res) => {
  // Clear the 'token' cookie
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out" });
};

exports.signup = async (req, res) => {
  try {
    const { name, handle, email, password } = req.body;

    // const existingEmailUser = await User.findOne({ email });
    // const existingHandleUser = await User.findOne({ handle });
    // if (existingEmailUser && existingHandleUser) {
    //   return res.status(400).send({ message: "Both email and handle already exist" });
    // } else if (existingEmailUser) {
    //   return res.status(400).send({ message: "Email already exists" });
    // } else if (existingHandleUser) {
    //   return res.status(400).send({ message: "Handle already exists" });
    // }

    // The create() method is equivalent to instantiating a document with new Model() and then calling save() on it.
    const user = new User({ name, handle, email, password });
    await user.save(); // re('save') middleware defined in src/models/User.js runs before the save()

    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    res.status(201).send({ rest });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const errorField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `The ${errorField} you entered is already in use` });
    }
    res.status(500).send({ message: error.message });
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
    res.status(500).send({ message: error.message });
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
    const likes = await Like.find({ user: user._id }).populate("post");
    const reposts = await Repost.find({ user: user._id }).populate("post");
    const bookmarks = await Bookmark.find({ user: user._id }).populate("post");
    const posts = await Post.find({ creator: user._id });
    const following = await Follow.find({ user: user._id }).populate("followedUser");
    const followers = await Follow.find({ followedUser: user._id }).populate("user");

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

exports.updateUser = async (req, res) => {
  try {
    const { handle } = req.params;
    const { name, bio, handle: newHandle, email, password, profilePhoto } = req.body;

    if (!name && !bio && !newHandle && !email && !password && !profilePhoto) {
      return res.status(400).send({ message: "At least one field is required to update the user" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { handle },
      { name, bio, handle: newHandle, email, password, profilePhoto },
      { new: true }
    );

    const { password: userPassword, __v, email: userEmail, ...rest } = updatedUser._doc;

    res.status(200).send(updatedUser);
    // res.status(200).send({ user: rest });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const errorField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `The ${errorField} you entered is already in use` });
    }
    res.status(500).send({ message: error.message });
  }
};

// exports.deleteUser = async (req, res) => {};
