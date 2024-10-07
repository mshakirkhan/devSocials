const express = require('express');
require('./config/database')
const app = express();
const User = require('./models/user')
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

const authRoute = require('./routes/auth');

app.use('/', authRoute);

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