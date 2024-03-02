// Path: src/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connection = require("./db/connection");
const { userRoutes, postRoutes, commentRoutes, likeRoutes } = require("./routes");

const port = process.env.PORT || 5001;

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(port, () => {
  connection();
  console.log(`Server is running on port ${port}`);
});
