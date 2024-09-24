const express = require('express');
require('./config/database')
const app = express();
const User = require('./models/user')

app.post("/signup", (req, res) => {
    const user = new User({
        firstName: "Muhammad Shakir",
        lastName: "Khan",
        email: "shakir.sedoc@gmail.com",
        age: 28,
        gender: "male"
    })
    user.save();
    res.send("User added successfully!")
})

app.listen(2000, (req, res) => {
    console.log("Server is running on port 2000!");
})