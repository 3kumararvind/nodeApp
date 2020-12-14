if(process.env.NODE_ENV!=='production'){
	require('dotenv').config();
}

const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
//setting ejs view engine
app.set("view engine", "ejs");
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose  = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

//start of importing models

//importing roles model
const role = require('./models/roles');

//importing user models
const users = require('./models/users');

//importing product models
const product = require('./models/products');

//importing product models
const cart = require('./models/cart');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://admin-brmfoundation:brmfoundationpass@cluster0-ojctd.mongodb.net/nodeAppTest", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});
//end connect
app.use(flash())
app.use(session({
	secret:process.env.SESSION_SECRET,
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.listen(process.env.PORT || 3000, function(){
	console.log("Server has started");
});


app.get('/', (req, res) => {
  res.render('index')
});

var errMsg = [];
var successMsg = [];

mongoose.set('useCreateIndex', true);

//passport.use(userDetail.createStrategy());
passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function(user, done){
  done(null, user);
});

let loginErrMsg = [];
passport.use( new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true },
            function(req, username, password, done){
            users.findOne({email:username}, function(err, doc){
              if(err){
                return done(err);
              }else{
                if(doc){
                  var valid = bcrypt.compareSync(password, doc.password);
                  if(valid){
                    return done(null, doc);
                  }else{
                    loginErrMsg=[];
                    loginErrMsg.push('Incorrect username/passwordss.');
                    return done(null, false, { message: 'Incorrect username/passwords.' });
                  }
                }else{
                    loginErrMsg=[];
                    loginErrMsg.push('Incorrect username/password.');
                   return done(null, false);
                }
              }
      })
}))

app.post("/login", passport.authenticate('local', {failureRedirect: '/login' }), function(req, res){
    let userRoleId = req.user.roleId;
    if(userRoleId==1){
      res.redirect("user-dashboard");
    }else {
    	  res.redirect("merchant-dashboard");
    }
});
//end of login post

//get login
app.get('/login', (req, res) => {

  res.render('login',{loginErrMsg:loginErrMsg});
});

const redirectLogin = (req, res, next)=>{
  if(!req.isAuthenticated()){
  		res.redirect("login");
	}else{
		next();
	}
}


//regiter get
app.get("/register", function(req, res){
	errMsg="";
	successMsg="";
	res.render("register", {errMsg:errMsg, successMsg:successMsg});
});


app.post("/register", async function(req, res){

	try {
		let password1 = req.body.password;
		let password2 = req.body.cnfpassword;
		let hashedPassword = await bcrypt.hash(password1, 10);
		let name = req.body.userName;
		let email = req.body.email;
		let phone = req.body.phone;
    let userCategory = req.body.registerAs;
		let phoneRegex = "[6789]{1}[0-9]{9}";
	  let phoneFlag=false;

		let nameRegex = "[a-zA-Z\s].*";
		let nameFlag=false;

		let emailRegEx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
		let emailFlag=false;

		if(name.match(nameRegex)){
			nameFlag = true;
		}else {
			nameFlag = false;
			errMsg = "Please enter valid name";
			successMsg="";
		}
		if(phone.match(phoneRegex)){
			phoneFlag=true;
			if(phone.length!=10){
				phoneFlag = false;
			}
		}else {
			phoneFlag = false;
			errMsg = "Please enter valid phone";
			successMsg="";
		}
		if(email.match(emailRegEx)){
			emailFlag=true;
		}else {
			emailFlag = false;
			errMsg = "Please enter valid email";
			successMsg="";
		}
		if(nameFlag == true && emailFlag == true && phoneFlag == true){
		/*	console.log("Name:"+ name);
			console.log("Email:"+ email);
			console.log("Phone:"+phone);
			console.log("currentTime:"+currentTime);
			console.log("Hashed Password:" + hashedPassword); */
			role.findOne({role_name:userCategory}, function(err, roleDetail){
				if(err){
					errMsg="Some error occured";
					res.render("register", {successMsg:successMsg, errMsg:errMsg});
				}else {

					users.findOne({name:name, email:email}, function(err, userDetail){
						if(err){
							errMsg = "Some error occured. Please try again.";
							successMsg="";
							console.log(errMsg);
							res.render("register", {successMsg:successMsg, errMsg:errMsg});
						}else if (userDetail) {
							errMsg = "User with this email id is already registered. Please try with another email.";
							successMsg="";
							console.log(errMsg);
							res.render("register", {successMsg:successMsg, errMsg:errMsg});
						}else {
							const newUser = new users({
								name:name,
								email:email,
								phone:phone,
								password:hashedPassword,
								roleId:roleDetail.role_id
							});
							newUser.save(function(err, savedUser){
								if(err){
									errMsg = err;
									successMsg="";
									console.log(errMsg);
									res.render("register", {successMsg:successMsg, errMsg:errMsg});
								}else {
									errMsg="";
									successMsg = "You have successfully registered. Please login to continue";
									console.log(successMsg);
									res.render("register", {successMsg:successMsg, errMsg:errMsg});
								}
							})
						}
					})
				}
			})

		}else {
			res.render("register", {successMsg:successMsg, errMsg:errMsg});
		}
	}catch(e){
		res.render("register", {successMsg:successMsg, errMsg:errMsg});
	}
});

//get login
app.get('/roles', (req, res) => {
  role.find({}).exec(function(err, roles){
    if(err){
      console.log(err);
    }else {
      res.render('roles',{roles:roles});
    }
  })
});
app.get('/products', (req, res) => {
  product.find({}).exec(function(err, products){
    if(err){
      console.log(err);
    }else {
      res.render('products',{products:products});
    }
  })
});
app.get('/merchant-dashboard', function(req, res){
	res.render('merchant-dashboard');
})

app.get('/user-dashboard', function(req, res){
	res.render('user-dashboard');
})

app.get('/update-stocks',redirectLogin, function(req, res){
	console.log("User:"+req);
	product.find({}).sort({product_id:1}).exec(function(err, products){
    if(err){
      console.log(err);
    }else {
      res.render('update-stocks',{products:products});
    }
  })

})


app.post('/update-stocks/:productId/:quantity', function(req, res){
	let productId = req.params.productId;
	let newStockQuantity= req.params.quantity;
	product.findOne({product_id:productId},{quantity:1, _id:0}).exec(function(err, Product){
    if(err){
      console.log(err);
			res.send(err);
    }else {
      console.log(Product);
			let newQuantity = Product.quantity + Number(newStockQuantity);
	   product.findOneAndUpdate({product_id:productId}, {$set:{quantity:newQuantity}},{new: true}, function(err, updateResult){
		if(err){
			res.send(err);
		}else{
			res.send("Product Quantity Updated. New quantity:"+updateResult.quantity);
		}
	})
    }
  })
})
