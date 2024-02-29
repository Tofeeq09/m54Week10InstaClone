// Path: src/middleware/connection.js

const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Authentication failed" });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: "Forbidden" });
    }
    next();
  };
};
