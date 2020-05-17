//jshint esversion:6

const mongoose = require("mongoose");
const schema = require("./models/model.js");
const bcrypt = require('bcrypt');

module.exports = function(app) {

  const Account = schema.getAccount;

  //home page, allows user to log in or register
  app.route("/")
    .get( (req, res) => {
      res.render("home");
    })
    .post( (req, res) => {
      email = req.body.email;
      //log user in if email exists
      Account.findOne({email: email}, (err, foundUser) => {
      //handle errors
        if(err) {
          console.log(err);
          res.send(err);
        } else {
          //if user is found
          if(foundUser) {
            //Use bcrypt to check if our pasword is the same as the hashed password saved in db
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
              //error check
              if(err) {
                res.send(err);
              } else {
                if(result) {
                  res.send("Successful login");
                } else {
                  res.send("Invalid credentials");
                }
              }
            });
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
                //use bcrypt to salt and encrypt paswords.
                console.log(Number(process.env.SALT_ROUNDS));
                console.log("Begin hashing");
                bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS), (err, hash) => {
                  //new user information
                  const newUser = new Account({
                    email: req.body.email,
                    password: hash,
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
                });
            }
        }
      });

    });


};
