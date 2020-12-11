const express = require('express')
const bodyParser = require('body-parser');
const app = express();

const port = 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose  = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;

const AutoIncrement = require('mongoose-sequence')(mongoose);


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/nodeAppTest";

//start of importing models

//importing roles model
const role = require('./models/roles');

//importing user models
const user = require('./models/users');

//importing product models
const product = require('./models/products');

//importing product models
const cart = require('./models/cart');

app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if (err)
  {
    throw err;
  }else{
    console.log("Database created!");
  }
}, );

app.listen(process.env.PORT || 3000, function(){
	console.log("Server has started");
});

//setting ejs view engine
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  let msg;
  res.render('index',{msg:msg})
});

var loginErrMsg = [];
var successMsg = [];
var errMsg=[];
mongoose.set('useCreateIndex', true);

app.post("/", function(req, res){
    let username = req.body.usernameInput;
    let password = req.body.pwdi;
    let msg;
    console.log("username:"+username);
    console.log("pwd:"+password);
    if(username=="testuser" && password=="test123"){
      console.log("You have entered valid password");
    }else{
      console.log("You have entered invalid password");
    }
    res.render("index" )
});
//end of login post
