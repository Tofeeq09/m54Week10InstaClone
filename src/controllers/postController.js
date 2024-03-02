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

exports.getPosts = async (req, res) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({ handle });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ creator: user._id }).populate("creator", "handle");

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
