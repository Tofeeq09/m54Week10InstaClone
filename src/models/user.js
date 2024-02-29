// models /User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
const { Schema } = mongoose;

// User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true, // name is mandatory
  },
  bio: {
    type: String,
  },
  handle: {
    type: String,
    required: true, // handle is mandatory
    unique: true, // handle must be unique
    index: true, // handle is indexed for performance
    validate: {
      validator: function (v) {
        // handle must follow a valid format
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid handle!`,
    },
  },
  email: {
    type: String,
    required: true, // email is mandatory
    unique: true, // email must be unique
    validate: {
      validator: function (v) {
        // email must follow a valid format
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // password must have a minimum length of 8 characters
        // and include at least one uppercase letter, one lowercase letter, one number, and one special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: (props) =>
        `Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character!`,
    },
  },
  profilePhoto: {
    type: String,
    validate: {
      validator: function (v) {
        // profilePhoto must follow a valid URL format if storing URL to external service
        return /^https?:\/\/.+/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  // posts field removed
});

// User middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // hash the password
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// User middleware
userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    // hash the password
    this._update.password = await bcrypt.hash(this._update.password, saltRounds);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
