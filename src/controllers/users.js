"use strict";
const NodeCache= require( "node-cache" );
const myCache= new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const { getUser, createUser, userLogin }= require("../models/users");
const validator = require('validator');
const { issueToken } = require("../middlewares/tokenValidator");

const signup= async (req, res)=> {
    try{
        let user= await userLogin(req.body.loginId);
        if(user) {
            res.status(400).json({success: false, message: "User already existed with this email or mobile number"})
        } else {
            let isEmail= await validator.isEmail(req.body.loginId)
            let userObj;
            if(isEmail) {
                userObj= {name: req.body.name, email: req.body.loginId}
            } else {
                userObj= {name: req.body.name, mobile: req.body.loginId}
            }
            user = await createUser(userObj)
            let token= await genarateOTP()
            await sendOtp(token, user._id, req.body.loginId, isEmail)
            res.status(200).json({success: true, message: "User created successfully", data: {userId: user._id}})
        }
    }catch(err) {
        res.status(400).json({success: false, message: err.message})
    }
}

const login= async (req, res)=> {
    try{
        let user= await userLogin(req.body.loginId)
        if(user) {
            let token= await genarateOTP()
            await sendOtp(token, user._id, req.body.loginId, await validator.isEmail(req.body.loginId))
            res.status(200).json({success: true, message: "OTP sent to your registered email", data: {userId: user._id}})
        } else {
            res.status(400).json({success: false, message: "Sorry!, We are unable to find your details."})
        }
    }catch(err) {
        res.status(400).json({success: false, message: err.message})
    }
}

const verifyOTP= async (req, res)=> {
    try{
        let user= await getUser(req.body.userId);
        if(user){
            let otp= await getCache(user._id);
            if(otp) {
                if(otp*1 == req.body.token*1){
                    let token= issueToken({userId: user._id, role: user.role, name: user.name})
                    res.status(200).json({success: true, message: "Logged in successfully", data: token})
                } else {
                    setCache(user._id, otp);
                    res.status(400).json({success: false, message: "Provided OTP is invalid or expired"})
                }
            } else {
                res.status(400).json({success: false, message: "Provided OTP is invalid or expired"})
            }
        }else {
            res.status(400).json({success: false, message: "Sorry!, We are unable to find your details."})
        }
    }catch(err) {
        res.status(400).json({success: false, message: err.message})
    }
}

const resendOTP= async (req, res)=> {
    try{
        let user= await getUser(req.body.userId);
        if(user){
            let token= getCache(user._id);
            if(!token) {
                token= genarateOTP()
            }
            sendOtp(token, user._id, user.email, true)
            res.status(200).json({success: true, message: "OTP sent successfully"})
        } else {
            res.status(400).json({success: false, message: "We are unable to find your details"})
        }
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

const getuser= async (req, res)=> {
    try{
        if(req.params.userId){
            let user= await getUser(req.params.userId);
            if(user){
                res.status(200).json({success: true, message: "user details", data: user})
            } else {
                res.status(400).json({success: false, message: "We are unable to find your details"})
            }
        } else {
            res.status(400).json({success: false, message: "UserId required"})
        }
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

const genarateOTP= async ()=>{
    try{
        let otp= Math.floor(1000 + Math.random() * 9000);
        console.log("otp : ", otp)      
        return otp
    }catch(err) {
        throw new Error(err.message ? err.message : "Unable to genarate OTP")
    }
}

const setCache= async(key, value)=> {
    try{
        await myCache.set(key.toString(), value, 100000);
        return "success"
    }catch(err){
        throw new Error(err.message ? err.message : "Unable to set cache")
    }
}

const getCache= async(key)=> {
    try{
        let cacheKey= await myCache.take(key.toString());
        return cacheKey
    }catch(err){
        throw new Error(err.message? err.message : "Unable to get the cache")
    }
}

const sendOtp= async (otp, userId, notificationSource, isEmail)=> {
    try{
        if(isEmail) {
            //send email for otp
        } else {
            // send sms for otp
        }
        setCache(userId, otp)
    }catch(err){
        console.log(otp, userId, notificationSource, isEmail)
        throw new Error(err.message ? err.message : "Unable to send email or sms")
    }

}

module.exports= {
    login: login,
    signup: signup,
    verifyOTP: verifyOTP,
    resendOTP: resendOTP,
    getuser: getuser
}