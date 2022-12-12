const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/assignment");
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../models/user")

const router = express.Router();

router.use(bodyParser.json());

router.post("/", body("name").isAlpha(), body("email").isEmail(), body("password").isLength({ min: 5 }), async (req, res) => {
    try {
        const errors = validationResult(req);
        let { name, email, password } = req.body; // destructuring
        if (errors.isEmpty()) {
            // checking if email already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.json({
                    status: "Failed",
                    message: "Entered email already exists"
                })
            }

            // if email is not already registered
            bcrypt.hash(password, 10, async function (err, hash) { // making password encrypted
                if (err) {
                    res.json({
                        status: "Failed"
                    })
                }
                else {
                    let newUser = await User.create({
                        name: name,
                        email: email,
                        password: hash
                    })
                    res.json({
                        status: "registration successfull",
                        user: newUser
                    })
                }
            }
            )
        }
        else {
            res.json({
                status: "Failed",
                message: "Invalid Input"
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