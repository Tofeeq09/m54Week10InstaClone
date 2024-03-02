// Path: src/controllers/userController.js

const jwt = require("jsonwebtoken");

const { User, Post, Comment, Message } = require("../models");

// Controller method for user signup
exports.signup = async (req, res) => {
  try {
    const { name, handle, email, password } = req.body;

    // The create() method is equivalent to instantiating a document with new Model() and then calling save() on it.
    const user = new User({ name, handle, email, password });
    await user.save(); // re('save') middleware defined in src/models/User.js runs before the save()

    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true });

    console.log(`token=${token}`); // For development purposes

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

// Controller method for user login
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

    console.log(`token=${token}`); // For development purposes

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

// Controller method for user logout
exports.logout = (req, res) => {
  try {
    res.clearCookie("token"); // Clear the token cookie
    res.status(200).json({ message: `User ${req.user.handle} has been logged out` });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller method for following a user
exports.followUser = async (req, res) => {
  try {
    const { handle } = req.params;
    const userToFollow = await User.findOne({ handle });

    if (!userToFollow) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the current user is already following the user to follow
    if (req.user.followingList.some((id) => id.equals(userToFollow._id))) {
      res.status(400).json({ message: `You are already following ${handle}` });
      return;
    }

    // Add the user to follow to the current user's following list and increment following count
    await User.updateOne({ _id: req.user._id }, { $push: { followingList: userToFollow._id }, $inc: { following: 1 } });

    // Add the current user to the user to follow's followers list and increment followers count
    await User.updateOne({ _id: userToFollow._id }, { $push: { followersList: req.user._id }, $inc: { followers: 1 } });

    // Re-fetch the current user document from the database and attach it to the req.user object
    req.user = await User.findById(req.user._id);

    res.status(200).json({ message: `You are now following ${handle}` });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller method for unfollowing a user
exports.unfollowUser = async (req, res) => {
  try {
    const { handle } = req.params;
    const userToUnfollow = await User.findOne({ handle });

    if (!userToUnfollow) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the current user is not following the user to unfollow
    if (!req.user.followingList.some((id) => id.equals(userToUnfollow._id))) {
      res.status(400).json({ message: `You are not following ${handle}` });
      return;
    }

    // Remove the user to unfollow from the current user's following list and decrement following count
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { followingList: userToUnfollow._id }, $inc: { following: -1 } }
    );

    // Remove the current user from the user to unfollow's followers list and decrement followers count
    await User.updateOne(
      { _id: userToUnfollow._id },
      { $pull: { followersList: req.user._id }, $inc: { followers: -1 } }
    );

    // Re-fetch the current user document from the database and attach it to the req.user object
    req.user = await User.findById(req.user._id);

    res.status(200).json({ message: `You are no longer following ${handle}` });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller method for getting all users
exports.getUsers = async (req, res) => {
  try {
    const searchQuery = (req.query.search || "").trim();
    let query = {};
    if (searchQuery !== "") {
      query = {
        $or: [{ name: { $regex: searchQuery, $options: "i" } }, { handle: { $regex: searchQuery, $options: "i" } }],
      };
    }

    const users = await User.find(query).select("-password -__v -email -followersList -followingList");

    res.status(200).json({ users });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

// Controller method for getting a user by handle
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ handle: req.params.handle })
      .populate("followersList", "handle")
      .populate("followingList", "handle");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, __v, email, ...rest } = user._doc;

    rest.posts = await Post.find({ creator: user._id });
    rest.comments = await Comment.find({ user: user._id });
    rest.likedPosts = await Post.find({ likedBy: user._id });
    rest.repostedPosts = await Post.find({ repostedBy: user._id });
    rest.bookmarkedPosts = await Post.find({ bookmarkedBy: user._id });

    res.status(200).json({ user: rest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller method for getting private user data
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

// Controller method for updating a user
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

// Controller method for deleting a user
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
