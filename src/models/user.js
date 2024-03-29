// Path: src/models/user.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
const { Schema } = mongoose;

// User schema
const userSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String },
  handle: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: function (v) {
        return /^\w+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
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
        return /^https?:\/\/.+/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    default: function () {
      return `https://picsum.photos/seed/${this._id}/200`;
    },
  },
  followers: { type: Number, default: 0 },
  followersList: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: { type: Number, default: 0 },
  followingList: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// In JavaScript, arrow functions do not have their own `this` context. They inherit `this` from the parent scope.
// In the context of Mongoose schema methods or middleware, using an arrow function can lead to unexpected results because `this` will not refer to the document instance or the query being executed.
// In my case, the `this` keyword in these functions is used to access the document being saved or updated, or the user document in the comparePassword method.
// If I were to convert these functions to arrow functions, `this` would not refer to the correct object, and the functions would not work correctly.

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

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};

// Add a text index to the handle and name fields for full-text search
userSchema.index({ handle: "text", name: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;
