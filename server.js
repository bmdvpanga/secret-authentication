//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;



//connect to mongoose db
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});


//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
  extended: true
}));

//create public file for class
app.use(express.static("public"));

//tells our app to use ejs as the view engine
app.set('view engine', 'ejs');


app.listen(port, () => {
  console.log("Listening to port " + port);
});

require('./app/routes.js')(app);
