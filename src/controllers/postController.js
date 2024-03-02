// Path: src/controllers/postController.js

const { User, Post, Comment, Message } = require("../models");

exports.addPost = async (req, res) => {
  try {
    const { caption, postImage } = req.body;
    const creator = req.user._id;

    const newPost = await Post.create({
      creator,
      content: {
        caption,
        postImage,
      },
    });

    const { __v, ...rest } = newPost._doc;

    res.status(201).json({ message: "Post created successfully", post: rest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has already liked the post
    if (post.likedBy.some((id) => id.equals(req.user._id))) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    // Add the authenticated user to the likedBy array and increment the likes count
    await Post.updateOne({ _id: postId }, { $push: { likedBy: req.user._id }, $inc: { likes: 1 } });

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has not liked the post
    if (!post.likedBy.some((id) => id.equals(req.user._id))) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // Remove the authenticated user from the likedBy array and decrement the likes count
    await Post.updateOne({ _id: postId }, { $pull: { likedBy: req.user._id }, $inc: { likes: -1 } });

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.repostPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has already reposted the post
    if (post.repostedBy.some((id) => id.equals(req.user._id))) {
      return res.status(400).json({ message: "You have already reposted this post" });
    }

    // Add the authenticated user to the repostedBy array and increment the reposts count
    await Post.updateOne({ _id: postId }, { $push: { repostedBy: req.user._id }, $inc: { reposts: 1 } });

    res.status(200).json({ message: "Post reposted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.unrepostPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has not reposted the post
    if (!post.repostedBy.some((id) => id.equals(req.user._id))) {
      return res.status(400).json({ message: "You have not reposted this post" });
    }

    // Remove the authenticated user from the repostedBy array and decrement the reposts count
    await Post.updateOne({ _id: postId }, { $pull: { repostedBy: req.user._id }, $inc: { reposts: -1 } });

    res.status(200).json({ message: "Post unreposted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has already bookmarked the post
    if (post.bookmarkedBy.some((id) => id.equals(req.user._id))) {
      return res.status(400).json({ message: "You have already bookmarked this post" });
    }

    // Add the authenticated user to the bookmarkedBy array and increment the bookmarks count
    await Post.updateOne({ _id: postId }, { $push: { bookmarkedBy: req.user._id }, $inc: { bookmarks: 1 } });

    res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.unbookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has not bookmarked the post
    if (!post.bookmarkedBy.some((id) => id.equals(req.user._id))) {
      return res.status(400).json({ message: "You have not bookmarked this post" });
    }

    // Remove the authenticated user from the bookmarkedBy array and decrement the bookmarks count
    await Post.updateOne({ _id: postId }, { $pull: { bookmarkedBy: req.user._id }, $inc: { bookmarks: -1 } });

    res.status(200).json({ message: "Post unbookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { q } = req.query; // Get the search query from the query parameters

    let posts = [];
    if (q) {
      const users = await User.find({ $text: { $search: q } });
      const userIds = users.map((user) => user._id);
      // Find posts whose creator is in the list of found users
      const postsByUser = await Post.find({ creator: { $in: userIds } }).populate(
        "creator",
        "handle name profilePhoto"
      );
      // Find posts whose caption matches the search query
      const postsByCaption = await Post.find({ $text: { $search: q } }).populate("creator", "handle name profilePhoto");
      // Combine the posts
      posts = [...postsByUser, ...postsByCaption];
    }

    if (!q) {
      posts = await Post.find().populate("creator", "handle name profilePhoto");
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPostsByHandle = async (req, res) => {
  try {
    const { handle } = req.params;
    const { q } = req.query;

    const user = await User.findOne({ handle });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const searchQuery = q ? { $text: { $search: q }, creator: user._id } : { creator: user._id };

    const posts = await Post.find(searchQuery).populate("creator", "handle name profilePhoto");

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("creator", "handle name profilePhoto");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: postId }).populate("user", "handle name profilePhoto");

    const postWithComments = {
      ...post._doc,
      comments,
    };

    res.status(200).json(postWithComments);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption, postImage } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the authenticated user is the creator of the post
    // The .toString() method converts the ObjectId to a string as the two cannot be compared directly as they are objects
    if (req.user._id.toString() !== post.creator.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        content: {
          caption,
          postImage,
        },
      },
      { new: true }
    );

    const { __v, ...rest } = updatedPost._doc;

    res.status(200).json({ message: "Post updated successfully", post: rest });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user._id.toString() !== post.creator.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
};
