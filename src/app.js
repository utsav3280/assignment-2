const express = require("express");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/assignment");

const userRegister = require("./routes/register");
const userLogin = require("./routes/login");
const userPosts = require("./routes/posts");
const jwt = require("jsonwebtoken");

const app = express();

// middleware for posts
app.use('/posts', (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        jwt.verify(token, 'ENCRYPT', function (err, decoded) {
            if (err) {
                return res.json({
                    status: "Failed",
                    message: "Not a valid token"
                })
            }
            req.userID = decoded.data;
            next();
        });
    }
    else {
        res.json({
            status: "Failed",
            message: "Please login first"
        })
    }
})

app.use("/register", userRegister);
app.use("/login", userLogin);
app.use("/posts", userPosts);

app.listen(3000, () => console.log("server is up and running at port 3000"))