const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

authRouter.post("/signup", async (req, res) => {
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
});

authRouter.post('/signIn', async(req, res) => {
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

module.exports = authRouter;