// Path: src/middleware/authenticate.js

const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.authenticate = async (req, res, next) => {
  // Use Cookie: token=<token> in the Headers tab
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid token" });
  }
};
