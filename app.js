require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));




const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://admin:_AbdulKhaliq@ac-m5zx3ns-shard-00-00.i2ian0y.mongodb.net:27017,ac-m5zx3ns-shard-00-01.i2ian0y.mongodb.net:27017,ac-m5zx3ns-shard-00-02.i2ian0y.mongodb.net:27017/Userdb?ssl=true&replicaSet=atlas-7yzf9p-shard-0&authSource=admin&retryWrites=true&w=majority');
        console.log("Db Connected");
    } catch (error) {
        console.log(error.message);
    }
}

connectDB();

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
}); 


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});



app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render("secret");
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser && foundUser.password === password) {
                res.render("secret");
            } else {
                console.log("Incorrect username or password");
            }
        })
        .catch(err => {
            console.log(err);
        });
});
        
app.listen(4100, function () {
    console.log("Server started on port 4100");
});
