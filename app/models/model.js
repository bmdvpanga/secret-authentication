//jshint esversion:6

const mongoose = require("mongoose");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');


//create account schema
const accountSchema = new mongoose.Schema({
  username: {
    // required: [true, "Missing email"],
    type: String
  },
  firstName: {
    // required: [true, "Missing first name"],
    type: String
  },
  lastName: {
    // required: [true, "Missing last name"],
    type: String
  },
  secret: {
    type: Array
  }
});


const secretSchema = new mongoose.Schema({
  secret: String
});

// Add plug in for passport local mongoose
accountSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    IncorrectUsernameError: "User does not exist.",
    IncorrectPasswordError: "Password is incorrect"
  }
});

const Account = mongoose.model("Account", accountSchema);
const Secret = mongoose.model("Secret", secretSchema);

//create strategy sets up passport local
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

exports.getAccount = Account;
exports.getSecret = Secret;
