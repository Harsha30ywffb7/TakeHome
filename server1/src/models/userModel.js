const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      match: /^[0-9]{10}$/,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;