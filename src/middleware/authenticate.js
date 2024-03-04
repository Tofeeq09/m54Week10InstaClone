// Path: src/middleware/authenticate.js

const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.persistentLogin = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

exports.authenticate = async (req, res, next) => {
  // Use Cookie: token=<token> in the Headers tab
  const token = req.cookies.token;

  if (!token) {
    res.clearCookie("token");
    res.status(401).json({ success: false, source: "authenticate", message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.clearCookie("token");
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ success: false, message: "Not authorized to access this route" });
    return;
  }
};
