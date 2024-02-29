const jwt = require("jsonwebtoken");

const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const payload = jwt.verify(token, "secret-key");
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
