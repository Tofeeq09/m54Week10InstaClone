// controllers/userController.js

const { User } = require("../models");

exports.signupUser = async (req, res) => {
  console.log(req.body);
  try {
    const { name, handle, email, password } = req.body;

    const user = new User({ name, handle, email, password });
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// exports.loginUser = async (req, res) => {};

// exports.getUser = async (req, res) => {};

// exports.updateUser = async (req, res) => {};

// exports.deleteUser = async (req, res) => {};
