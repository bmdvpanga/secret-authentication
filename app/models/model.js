//jshint esversion:6

const mongoose = require("mongoose");
//create account schema
const accountSchema = new mongoose.Schema({
  email: {
    required: [true, "Missing email"],
    type: String
  },
  password: {
    required: [true, "Missing password"],
    type: String
  },
  firstName: {
    required: [true, "Missing first name"],
    type: String
  },
  lastName: {
    required: [true, "Missing last name"],
    type: String
  }
});

Account = mongoose.model("Account", accountSchema);

exports.getAccount = Account;
