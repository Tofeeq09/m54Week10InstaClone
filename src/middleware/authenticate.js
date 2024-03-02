// Path: src/middleware/authenticate.js

const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.authenticate = async (req, res, next) => {
  // Use Cookie: token=<token> in the Headers tab
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
