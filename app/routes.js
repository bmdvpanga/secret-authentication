//jshint esversion:6

const mongoose = require("mongoose");
const schema = require("./models/model.js");
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
// const flash = require('connect-flash');
module.exports = function(app) {

  const Account = schema.getAccount;
  const Secret = schema.getSecret;
  //home page, allows user to log in or register
  app.route("/")
    .get((req, res) => {
      res.render("home");
    })

    //User log in
    .post((req, res) => {
      username = req.body.username;
      password = req.body.password;
      //log user in if email exists
      const user = new Account({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });

      passport.authenticate('local', function(err, user, info) {
        if (err) {
          req.flash("error_msg", err);
          console.log(err);
          return res.redirect("/");
        }
        if (info) {
          console.log(err);
          req.flash("error_msg", info.message);
          console.log(typeof info);
          return res.redirect('/');
        }
        req.logIn(user, function(err) {
          if (err) {
            req.flash("error_msg", err);
            console.log(err);
            console.log(info);
            res.redirect("/");
           }
          return res.redirect('/secrets');
        });
      })(req, res);

    });

  app.route("/register")
    .get((req, res) => {
      res.render("register");
    })
    .post((req, res) => {
      const {
        username,
        firstName,
        lastName,
        password,
        password2
      } = req.body;
      let errors = [];

      //error message handling
      //if any of the fields are blank, populate error field
      if (!username || !firstName || !lastName || !password || !password2) {
        errors.push({
          msg: "Please fill in all of the fields."
        });
      }

      if (req.body.password !== req.body.password2) {
        errors.push({
          msg: "Passwords are not matching"
        });
      }

      //if there are errors, then we
      if(errors.length > 0) {
        console.log(errors);
        res.render("register", {errors, username, firstName, lastName, password, password2});
      } else {
        Account.register({
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }, req.body.password, (err, user,passwordErr) => {
          if (err) {
            errors.push({
              msg: err.message
            });
            res.render("register", {errors, username, firstName, lastName, password, password2});
          } else {
              req.flash("success_msg", "You have successfully registered. Please log in.");
              res.redirect("/");
          }
        });
      }
    });

  app.route("/secrets")
    .get((req, res) => {
      //if user is authenticated or already logged in, then secret-auth page is rendered, otherwise, they are taken to regular secrets passportLocalMongoose
      //regular secrets page has no submit button and can only view users
      Secret.find( {}, (err, foundSecrets) => {
            if (req.isAuthenticated()) {
              res.render("secrets-auth", {userSecrets: foundSecrets, firstName: req.user.firstName, lastName: req.user.lastName});
            } else {
              res.render("secrets", {userSecrets: foundSecrets});
            }
      });
    })
    //When user posts a secret on the page, add the secret to the user's database
    .post ((req,res) => {
      //create a new document that holds the secret submitted by user
      submittedSecret = new Secret( {
        secret: req.body.secret
      });

      submittedSecret.save( (err) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect("/secrets");
        }
      });
    });

  app.route("/logout")
    .get((req, res) => {
      req.logout();
      req.flash("success_msg", "You have successfully logged out.");
      res.redirect("/");
    });
};
