// Path: src/middleware/validation.js

const bcrypt = require("bcrypt");

exports.checkPasswordChanged = async (req, res, next) => {
  const { password } = req.body;
  req.passwordChanged = false;

  if (password) {
    const isPasswordChanged = await bcrypt.compare(password, req.user.password);
    // console.log(isPasswordChanged); // true if password is unchanged
    if (!isPasswordChanged) {
      req.passwordChanged = true;
    }
  }
  //   console.log(req.passwordChanged); // false if password is unchanged
  next();
};
