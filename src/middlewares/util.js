"use strict";
const { validationResult }= require('express-validator');

const extractErrorMessages= (errors)=> {
    let messages = [];
    errors.forEach(function(error){
        messages.push(error.msg);
    });
    return messages
}

const requestValiator= (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let msg= extractErrorMessages(errors.errors)
        return res.status(400).json({success: false, message: msg});
    }
    next();
}


module.exports = {
    extractErrorMessages: extractErrorMessages,
    requestValiator: requestValiator
}