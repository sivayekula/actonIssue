"use strict";
const express= require('express');
const { loginValiator, signupValiator } = require('../config/util');
const { login, signup, verifyToken } = require('../controllers/users');
const router= express.Router();

router.use(express.json())


router.post("/signup", signupValiator, signup);
router.post("/login", loginValiator, login);
router.post("/verifyToken", verifyToken)
router.get('/getUsers', (req, res)=> {
    res.json({status: 200, message: "server is running"})
})

module.exports = router