// Path: src/controllers/userController.js

const jwt = require("jsonwebtoken");

const { User, Like, Repost, Comment, Bookmark, Post, Follow } = require("../models");

exports.login = async (req, res) => {
  try {
    const { email, handle, password } = req.body;

    if (!email && !handle) {
      res.status(400).json({ message: "Email or handle is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const user = await User.findOne({
      $or: [{ email }, { handle }],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email/handle or password" });
      return;
    }

    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true });

    console.log(`res.get("Set-Cookie"): ${res.get("Set-Cookie")}`); // For development purposes

    res.status(200).json({ user: rest });
    return;
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const errorField = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `The ${errorField} you entered is already in use` });
      return;
    }
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.logout = (req, res) => {
  // Clear the 'token' cookie

  res.clearCookie("token");
  res.status(200).json({ message: `User ${req.user.handle} has been logged out` });
};

exports.signup = async (req, res) => {
  try {
    const { name, handle, email, password } = req.body;

    // const existingEmailUser = await User.findOne({ email });
    // const existingHandleUser = await User.findOne({ handle });
    // if (existingEmailUser && existingHandleUser) {
    //   res.status(400).json({ message: "Both email and handle already exist" });
    //   return;
    // } else if (existingEmailUser) {
    //   res.status(400).json({ message: "Email already exists" });
    //   return;
    // } else if (existingHandleUser) {
    //   res.status(400).json({ message: "Handle already exists" });
    //   return;
    // }

    // The create() method is equivalent to instantiating a document with new Model() and then calling save() on it.
    const user = new User({ name, handle, email, password });
    await user.save(); // re('save') middleware defined in src/models/User.js runs before the save()

    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    res.status(201).json({ rest });
    return;
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const errorField = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `The ${errorField} you entered is already in use` });
      return;
    }
    res.status(500).json({ message: error.message });
    return;
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

    res.status(200).json({ users });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

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
      posts,
      reposts,
      likes,
      bookmarks,
      following,
      followers,
    };

    res.status(200).json(result);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid user handle" });
      return;
    }

    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.getPrivate = async (req, res) => {
  try {
    const { handle } = req.params;

    if (req.user.handle !== handle) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const email = req.user.email;

    res.status(200).json({ email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { handle } = req.params;
    const { name, bio, handle: newHandle, email, password, profilePhoto } = req.body;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.handle !== handle) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    if (!name && !bio && !newHandle && !email && !password && !profilePhoto) {
      res.status(400).json({ message: "At least one field is required to update the user" });
      return;
    }

    // Construct an update object that only includes the fields provided in req.body
    const update = {};
    if (name) update.name = name;
    if (bio) update.bio = bio;
    if (newHandle) update.handle = newHandle;
    if (email) update.email = email;
    if (req.passwordChanged) update.password = password;
    if (profilePhoto) update.profilePhoto = profilePhoto;

    // By default, findOneAndUpdate() returns the document as it was before the update was applied.
    // The { new: true } option, returns the document after the update has been applied.
    const updatedUser = await User.findOneAndUpdate({ handle }, update, { new: true });
    const { password: userPassword, __v, email: userEmail, ...rest } = updatedUser._doc;

    let changes = [];
    for (const key in update) {
      if (req.user[key] !== updatedUser[key]) {
        changes.push({ field: key, oldValue: req.user[key], newValue: updatedUser[key] });
      }
      changes = changes.filter((change) => change.field !== "password");
      if (key === "password") {
        changes.push({ field: key, oldValue: "********", newValue: "********" });
      }
    }

    // res.status(200).json(updatedUser);
    res.status(200).json({ user: rest, changes });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const errorField = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `The ${errorField} you entered is already in use` });
      return;
    }
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { handle } = req.params;
    const { password } = req.body;

    if (req.user.handle !== handle) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const isMatch = await req.user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const user = await User.findOneAndDelete({ handle: req.user.handle });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(`User ${handle} has been deleted`);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};
