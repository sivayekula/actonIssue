"use strict";
const { body, validationResult, checkExact }= require('express-validator');

const error= (message= "ERROR", code= 400, httpCode= 400)=> {
    let status = {
        error_code: `${code}`,
        error_message: message,
        http_code: httpCode
    }
    return status
}

const getJwtToken= (tokenData)=> {
    let jwtToken = jwt.sign(tokenData, config.JWT_SECRET, { expiresIn: '1h' });
    return jwtToken
}


const loginValiator= [
    body("identifier").trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Invalid email address!'),
    checkExact(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
        next();
    }
]

const signupValiator= [
    body("identifier").trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Invalid email address!'),
    body("name").not()
    .isEmpty()
    .isLength({ min: 3}).withMessage("name must be greater than 3 letters"),
    checkExact(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
        next();
    }
]




module.exports = {
    error: error,
    loginValiator: loginValiator,
    signupValiator: signupValiator,
    getJwtToken: getJwtToken
}