const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name must be no longer than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "The email field is required"],
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required"],
    select: false,
    minlength: [2, "Password must be at least 2 characters long"],
    maxlength: [70, "Password must be no longer than 70 characters"],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password name email") //combined into one line
    .then((user) => {
      console.log("Found user with data:", user);
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        console.log("Password match:", isMatch);
        if (!isMatch) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
