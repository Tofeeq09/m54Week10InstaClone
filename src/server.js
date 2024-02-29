// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connection = require("./db/connection");
const { userRoutes } = require("./routes");

const port = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());

connection();

app.use("/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
