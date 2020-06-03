//jshint esversion:6

const mongoose = require("mongoose");
const schema = require("./models/model.js");
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
module.exports = function(app) {

  const Account = schema.getAccount;

  //home page, allows user to log in or register
  app.route("/")
    .get( (req, res) => {
      res.render("home");
    })
    //User log in
    .post( (req, res) => {
      username = req.body.username;
      password = req.body.password;
      //log user in if email exists
      Account.findOne({username: username}, (err, foundUser) => {
      //handle errors
        if(err) {
          console.log(err);
          res.send(err);
        } else {
          //if user is found
          if(foundUser) {
            const user = new Account({
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
            });
            req.logIn(user, (err) => {
                if(err) {
                  console.log(err);
                  res.redirect("/");
                } else {
                  passport.authenticate("local")(req, res, () => {
                    //if authentication is successful, redirect to secrets route
                    res.redirect("/secrets");
                  });
                }
            });
          } else {
            console.log(req);
            console.log(foundUser);
            res.send("user does not exist");
          }
        }
      });
    });

  app.route("/register")
    .get((req,res)=> {
      res.render("register");
    })
    .post((req,res)=> {

      if(req.body.password !== req.body.password2) {
        console.log("Passwords are not matching");
        res.redirect("/register");
      } else {
        Account.findOne( { username: req.body.username}, (err, foundUser) => {
          //error handling
          if(err) {
            console.log(err);
            res.send(err);
          } else {
            //if user is already in database
              if(foundUser) {
                //Modify for error pop up later
                res.send("User exists");
              } else {
                  Account.register( {username: req.body.username,firstName: req.body.firstName,lastName: req.body.lastName }, req.body.password, (err, user) => {
                    if(err) {
                      console.log(err);
                      res.redirect("/register");
                    } else {
                      passport.authenticate("local")(req, res, () => {
                        //if authentication is successful, redirect to secrets route
                        res.redirect("/secrets");
                      });
                    }
                });
              }
          }
        });
      }
    });

  app.route("/secrets")
    .get((req,res) => {
      //if user is authenticated or already logged in, then secret page is rendered
      if ( req.isAuthenticated() ) {
        console.log("Authenticated");
        res.render("secrets");
      } else {
        console.log("Not authenticated");
        res.redirect("/");
      }

    });
};
