//jshint esversion:6

const mongoose = require("mongoose");
const schema = require("./models/model.js");
var encrypt = require('mongoose-encryption');

module.exports = function(app) {

  const Account = schema.getAccount;

  app.route("/")
    .get( (req, res) => {
      res.render("home");
    })
    .post( (req, res) => {
      email = req.body.email;
      password = req.body.password;

      //log user in if email exists
      Account.findOne({email: email}, (err, foundUser) => {
        //handle errors
        if(err) {
          console.log(err);
          res.send(err);
        } else {

          //if user is found
          if(foundUser) {
            //if password is correct
            if(password === foundUser.password) {
              res.send("Successful login");
            } else {
              res.send("Invalid credentials");
            }
          } else {
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

      //check if user email already exists in database, if not, create user
      Account.findOne( { email: req.body.email}, (err, foundUser) => {

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

                //new user information
                const newUser = new Account({
                  email: req.body.email,
                  password: req.body.password,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName
                });

                //save user to the database
                newUser.save( (err) => {
                  if(!err) {
                    console.log("User saved in database");
                    res.send("User created");
                  }
                });
            }
        }
      });

    });


};
