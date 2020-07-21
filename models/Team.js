const mongoose = require("mongoose");
const TeamSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a team name"],
    unique: true,
    trim: true,
    maxlength: [50, "Team name can not be more than 50 characters"],
  },
  code: {
    type: String,
    required: [true, "Please add a team code"],
    unique: true,
    trim: true,
    maxlength: [5, "Team code can not be more than 5 characters"],
  },
  logo: {
    type: String,
    default: "no-logo.jpg",
  },
  city: {
    type: String,
    required: [true, "Please add city"],
  },
  country: {
    type: String,
    required: [true, "Please add country"],
  },
  stadium: {
    type: String,
  },
  year_founded: {
    type: Number,
  },
  coach: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Team", TeamSchema);
