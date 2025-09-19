//maybe import roles into users? 4.15.2025

const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/token");
const User = require("../models/user");

//CREATE
const createUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can't be empty" });
  }

  //should I add a role here and in the schema?
  const { name, email, password } = req.body;

  try {
    // Check for existing user first
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        message: "User with this email already exists",
      });
    }

    // Hash the password to add security
    const hashedPassword = await bcrypt.hash(password, 10); //this adds 10 characters to the password to hash it

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response, conceals it
    const { password: pwd, ...userWithoutPassword } = newUser.toObject();
    return res.status(201).send({ data: userWithoutPassword });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log("Validation error details:", err);
      return res.status(400).send({ message: "Invalid data" });
    }
    if (err.code === 11000) {
      return res.status(409).send({
        message: "User with this email already exists",
      });
    }

    return res.status(500).send({
      message: "An error has occurred on the server",
    });
  }
};

//RETRIEVE USERS
const login = (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with:", { email });

  if (!email || !password) {
    return res.status(400).send({
      message: "The email and password fields are required",
    });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("Full user object:", user); // Debug full user object
      console.log("User role:", user.role); // Debug role specifically

      const token = createToken({ _id: user._id });
      const { password: pwd, ...userWithoutPassword } = user.toObject();

      console.log("User data being sent:", userWithoutPassword); // Debug response data

      res.status(200).send({ user: userWithoutPassword, token });
    })
    .catch((err) => {
      console.log("Login error:", err.message);
      res.status(401).send({ message: err.message });
    });
};

//RETRIEVE USER BY ID
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send({ message: "Item id not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Could not find user from getCurrentUser controller" });
  }
};

//UPDATE
const modifyUserData = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
    };
    const updateUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      const error = new Error("User id not found from modifyUserData");
      error.statusCode = 404;
      throw error;
    });
    return res.status(200).send(updateUser);
  } catch (error) {
    if (error.name === "Not Found") {
      return res.status(404).send({ message: error.message });
    }
    if (error.name === "Validation Error") {
      return res.status(400).send({ message: "provided data is incorrect" });
    }
    return res
      .status(500)
      .send({ error: "Could not update user from modifyUserData" });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  modifyUserData,
};
