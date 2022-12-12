const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/assignment");
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../models/user");
const secret = "ENCRYPT";

const router = express.Router();

router.use(bodyParser.json());

router.post("/", body("email").isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        let { email, password } = req.body; // destructring
        if (errors.isEmpty()) {
            // checking if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.json({
                    status: "Failed",
                    message: "user does not exists"
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                // result == true
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                if (result) { // true
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                    }, secret);

                    return res.json({
                        status: "success",
                        message: "Login successfull",
                        jwt: token
                    })
                }
                // not true
                res.json({
                    status: "Failed",
                    message: "Invalid Password"
                })
            });
        }
        else {
            res.json({
                status: "Failed",
                message: "please enter a valid email"
            })
        }
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        })
    }
});

module.exports = router;