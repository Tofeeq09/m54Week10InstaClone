// Path: src/controllers/postController.js

const { User, Like, Repost, Comment, Bookmark, Post, Follow } = require("../models");

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

exports.getAllPosts = async (req, res) => {
  try {
    const { q } = req.query; // Get the search query from the query parameters

    let posts = [];
    if (q) {
      const users = await User.find({ $text: { $search: q } });
      const userIds = users.map((user) => user._id);

      // Find posts whose creator is in the list of found users
      const postsByUser = await Post.find({ creator: { $in: userIds } }).populate("creator", "handle name");

      // Find posts whose caption matches the search query
      const postsByCaption = await Post.find({ $text: { $search: q } }).populate("creator", "handle name");

      // Combine the posts
      posts = [...postsByUser, ...postsByCaption];
    }

    if (!q) {
      posts = await Post.find().populate("creator", "handle name");
    }

    // Add the count of likes, comments, and bookmarks to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likeCount, repostCount, commentCount, bookmarkCount] = await Promise.all([
          Like.countDocuments({ post: post._id }),
          Repost.countDocuments({ post: post._id }),
          Comment.countDocuments({ post: post._id }),
          Bookmark.countDocuments({ post: post._id }),
        ]);

        return {
          ...post._doc,
          likeCount,
          repostCount,
          commentCount,
          bookmarkCount,
        };
      })
    );

    res.status(200).json(postsWithCounts);
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

    const posts = await Post.find(searchQuery).populate("creator", "handle");

    // Add the count of likes, comments, and bookmarks to each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likeCount, repostCount, commentCount, bookmarkCount] = await Promise.all([
          Like.countDocuments({ post: post._id }),
          Repost.countDocuments({ post: post._id }),
          Comment.countDocuments({ post: post._id }),
          Bookmark.countDocuments({ post: post._id }),
        ]);

        return {
          ...post._doc,
          likeCount,
          repostCount,
          commentCount,
          bookmarkCount,
        };
      })
    );

    res.status(200).json(postsWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("creator", "handle name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const [likeCount, repostCount, commentCount, bookmarkCount] = await Promise.all([
      Like.countDocuments({ post: postId }),
      Repost.countDocuments({ post: postId }),
      Comment.countDocuments({ post: postId }),
      Bookmark.countDocuments({ post: postId }),
    ]);

    const postWithCounts = {
      ...post._doc,
      likeCount,
      repostCount,
      commentCount,
      bookmarkCount,
    };

    res.status(200).json(postWithCounts);
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

    // Check if the authenticated user is the creator of the post
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
