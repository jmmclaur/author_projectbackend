require("dotenv").config(); //this means .env file will be read and loads the environment variables
// into the Node.js application
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;
mongoose.set("strictQuery", false);
mongoose
  //.connect("mongodb://127.0.0.1:27017/author_project") //replace local database with atlas link when deploying
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
app.use(express.json());
app.use(cors());
//app.use("/author_project", mainRouter);
app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
