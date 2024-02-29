// controllers/userController.js

const { User } = require("../models");

exports.signupUser = async (req, res) => {
  try {
    const { name, handle, email, password } = req.body;

    const user = new User({ name, handle, email, password });
    await user.save();
    const { password: userPassword, __v, email: userEmail, ...rest } = user._doc;

    res.status(201).send({ rest });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    const sanitizedUsers = users.map((user) => {
      const { password, __v, email, ...rest } = user._doc;
      return rest;
    });

    res.status(200).send({ sanitizedUsers });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// exports.loginUser = async (req, res) => {};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const { password, __v, email, ...rest } = user._doc;

    res.status(200).send({ rest });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

// exports.updateUser = async (req, res) => {};

// exports.deleteUser = async (req, res) => {};
