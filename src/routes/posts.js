const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/assignment");
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../models/user");
const Post = require("../models/post");
const secret = "ENCRYPT";

const router = express.Router();

router.use(bodyParser.json());

router.post("/", async (req, res) => {
    try {
        let post = await Post.create({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image,
            user: req.userID
        })
        res.send(post);
    } catch (error) {
        res.json({
            status: "Failed",
            message: "Some error occured"
        })
    }
})

router.put("/:id", async (req, res) => {
    try {
        let post = await Post.findOne({ _id: req.params.id });
        if (post) {
            let userValidate = (post.user).toString(); // creator // req.userId = logged in currently
            if (userValidate !== req.userID) { return res.send("You cannot edit this post") };
            await Post.updateOne({ _id: req.params.id }, { $set: { title: req.body.title, body: req.body.body, image: req.body.image } });
            let updated_post = await Post.find({ _id: req.params.id })
            res.json({
                status: "success",
                updated_post
            })
        }
        else {
            res.json({
                status: "Failed",
                message: "Post does not exist"
            })
        }
    } catch (error) {
        res.json({
            status: "Failed",
            message: "Some error occured"
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        let post = await Post.find({ _id: req.params.id });
        if (post) {
            console.log((post.user))
            if (user1 !== req.userID) { return res.send("You cannot delete this post") };
            await Post.deleteOne({ _id: req.params.id });
            res.json({
                status: "success"
            })
        }
        else {
            res.json({
                status: "Failed",
                message: "Post does not exist"
            })
        }
    } catch (error) {
        res.json({
            status: "Failed",
            message: "Some error occured"
        })
    }
})

module.exports = router;