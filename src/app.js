const express = require('express');
require('./config/database')
const app = express();
const User = require('./models/user')

app.use(express.json());

app.post("/signup", async (req, res) => {
    const data = req.body;
    const user = new User(data)
    await user.save();
    res.send("User added successfully!")
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
        res.status(500).send(err.message)
    }
})

app.patch("/updateUser", async (req, res) => {
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(data.id, data, {returnDocument:'before'});
        res.send(user);
    }
    catch(err) {
        res.status(500).send(err.message);
    }
})

app.listen(2000, (req, res) => {
    console.log("Server is running on port 2000!");
})