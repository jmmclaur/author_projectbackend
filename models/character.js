const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const characterSchema = new mongoose.Schema({
  characterName: {
    type: String,
    required: [true, "The name field is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name must be no longer than 50 characters"],
  },
  characterAge: {
    type: Number,
    required: [true, "The age field is required"],
    min: [20, "Age must be at least 20 years old"],
  },
  characterWeapon: {
    type: String,
    required: [true, "The weapon field is required"],
    minlength: [2, "Weapon must be at least 2 characters long"],
    maxlength: [50, "Weapon must be no longer than 50 characters"],
  },
  characterBrigade: {
    type: String,
    required: [true, "The brigade field is required"],
    minlength: [2, "Brigade must be at least 2 characters long"],
    maxlength: [50, "Brigade must be no longer than 50 characters"],
  },
  characterImage: {
    type: String, //set up to convert to base64 string for image storage
    required: true,
  },
  characterLikes: {
    type: String,
    required: true,
  },
  characterDislikes: {
    type: String,
    required: true,
  },
  characterGoals: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("character", characterSchema);
