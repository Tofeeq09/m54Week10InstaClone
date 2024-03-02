// Path: src/utils/commentUtils.js

const buildCommentTree = (comments, parentId = null) => {
  const commentTree = [];

  for (const comment of comments) {
    if (String(comment.parent) === String(parentId)) {
      const children = buildCommentTree(comments, comment._id);
      const commentObj = comment.toObject();
      if (children.length > 0) {
        commentObj.children = children;
      }
      commentTree.push(commentObj);
    }
  }

  return commentTree;
};

module.exports = buildCommentTree;
