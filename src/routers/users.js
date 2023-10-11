"use strict";
const express= require('express');
const { loginSchema, signupSchema, verifyOTPSchema, resendOTPSchema } = require('../middlewares/userRequestValidator');
const { login, signup, verifyOTP, resendOTP, getuser, updateUser, addProfilePic } = require('../controllers/users');
const { verifyToken } = require('../middlewares/tokenValidator');
const { requestValiator } = require('../middlewares/util');
const router= express.Router();


router.use(express.json())


router.post("/signup", signupSchema, requestValiator, signup);
router.post("/login", loginSchema, requestValiator, login);
router.post("/verifyOTP", verifyOTPSchema, requestValiator, verifyOTP)
router.post("/resendOTP", resendOTPSchema, requestValiator, resendOTP)
router.get('/getUser', verifyToken, getuser);
router.post("/update", verifyToken, updateUser);
module.exports = router