const express = require('express');
require('./config/database')
const app = express();
const User = require('./models/user')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, email, password, age, gender, skills} = req.body;
        const hashPass = bcrypt.hashSync(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPass,
            age: age,
            gender: gender,
            skills: skills
        })
        await user.save();
        res.send("User added successfully!")
    }
    catch(err) {
        res.status(400).send("Error " + err.message)
    }
})

app.post('/signIn', async(req, res) => {
    try {
        const {email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("Invalid Credentials");
        }
        const passResult = await bcrypt.compareSync(password, user.password);
        if(!passResult) {
            throw new Error("Invalid Credentials");
        }
        const token = await jwt.sign({id: user._id}, process.env.JWT_PRIVATE_KEY);
        res.cookie("token", token)
        res.send("Login Successfully!");
    }
    catch(err) {
        res.status(400).send(err.message);
    }
})

app.get("/listUser", async (req, res) => {
    try {
        const user = await User.find({});
        res.send(user);
    }
    catch(err) {
        res.status(500).send(err.message);
    }
})

app.delete("/deleteUser", async(req, res) => {
    const {id} = req.body;
    try {
        await User.findByIdAndDelete(id);
        res.send("User deleted successfully");
    }
    catch(err) {
        res.status(500).send(err.message);
    }
})

app.patch("/updateUser", async (req, res) => {
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(data.id, data, {
            returnDocument:'before',
            runValidators:true
        });
        res.send(user);
    }
    catch(err) {
        res.status(500).send(err.message);
    }
})

app.get("/getProfile", async (req, res) => {
    try {
        const {token} = req.cookies;
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        if(decoded) {
            const user = await User.find({_id: decoded.id});
            res.send(user);
        }
    }
    catch(err) {
        res.send(err.message);
    }
})

app.listen(2000, (req, res) => {
    console.log("Server is running on port 2000!");
})