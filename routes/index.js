//index.js serves as the main traffic for entire API
const express = require("express");
const router = express.Router();
const { not_found } = require("../utils/errors");
const userRouter = require("./users");
const characterRouter = require("./characters");
const { auth } = require("../middlewares/auth"); //protect the routes
const { login, createUser } = require("../controllers/users");

// Move this FIRST - before any route handlers
router.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.path}`);
  next();
});

//USERS
//// Authentication routes (no auth middleware needed)
router.post("/signin", login);
router.post("/signup", createUser);

//// User routes (protected)
router.use("/users", auth, userRouter);

//CHARACTERS
router.use("/characters", auth, characterRouter); //mounts character router at /characters

//ERROR HANDLING
router.use((req, res) => {
  res.status(404).send({ message: "Not found" });
}); //if nothing matches, then errors will show

module.exports = router;
