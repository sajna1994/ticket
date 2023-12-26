
const express = require('express')
const router = require('express').Router();
const jwt = require("jsonwebtoken");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


mongoose = require('mongoose')
const movieDATA = require('../models/Movie')
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const UserDATA = require('../models/User')
//login api
router.get('/userlist/', async (req, res) => {
    let data = await UserDATA.find()
    try {

        res.json(data)


    } catch (error) {
        res.send(error.message)
    }
})

router.get('/userlist/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserDATA.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log('password+++++++++')
    console.log(password)
    console.log(email)
    const user = await UserDATA.findOne({ email: email });
    console.log(user)
    if (!user) {
        res.json({ message: "user not found" })
    }
    try {
        if (user.password == password) {
            jwt.sign({ email: email, id: user._id }, "ict", { expiresIn: '1d' }, (error, token) => {
                if (error) {
                    res.json({ message: "Token not generated" })
                } else {
                    res.json({ message: "Login Success", token: token, data: user })
                }
            })

        }
        else {
            res.json({ message: "Login Failed" })
        }
    }
    catch (error) {

    }
})

router.post('/user', async (req, res) => {
    try {
        console.log(req.body);
        let item = req.body;
        console.log(req.body.email);
        let email = req.body.email;

        let existingUser = await UserDATA.findOne({ email: email });

        if (existingUser) {
            res.json({ message: "User Already exists, Please try with another email Id" });
        } else {
            console.log('saved');
            const user = new UserDATA(item); 
            await user.save();
            res.json({ message: "Registered Successfully" });
        }
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router