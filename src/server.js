require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connection = require("./db/connection");
const bookRouter = require("./books/routes");

const port = process.env.PORT || 5001;
const app = express();
app.use(cors());

app.use(express.json());

connection();

app.use("/books", bookRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
