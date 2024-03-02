// Path: src/middleware/index.js

const authenticate = require("./authenticate");
const validation = require("./validation");

module.exports = {
  authenticate,
  validation,
};
