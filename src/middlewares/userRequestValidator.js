"use strict";
const { body, checkExact, oneOf, check }= require('express-validator');

const loginSchema = [
    oneOf(
        [body('loginId').matches(/^\d{10}$/), body('loginId').isEmail().normalizeEmail()],
        {message: "Valid email or phoneNumber is required"}
    ),
    check("password").isLength({min: 6, max: 10}).withMessage("Password must be graterthen 6 and lessthen 10")  
];

const signupSchema = [
    oneOf(
        [check('loginId').matches(/^\d{10}$/), check('loginId').isEmail().normalizeEmail()],
        {message: "Valid email or phoneNumber is required"}
    ),
    check("name").isAlphanumeric().isLength({min: 3, max: 20}).withMessage("Name must be graterthen 3 and lessthen 20"),
    check("password").isLength({min: 6, max: 10}).withMessage("Password must be graterthen 6 and lessthen 10")
];

const verifyOTPSchema = [
    check('userId').isMongoId().withMessage("Please provide valid userId"),
    check("token").isAlphanumeric().isLength({min: 4, max: 4}).withMessage("Token must be 4 charecters long")
];

const resendOTPSchema = [
    check('userId').isMongoId().withMessage("Please provide valid userId")
];








module.exports = {
    loginSchema: loginSchema,
    signupSchema: signupSchema,
    verifyOTPSchema: verifyOTPSchema,
    resendOTPSchema: resendOTPSchema
}