"use strict";
const NodeCache= require( "node-cache" );
const myCache= new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const { getUser, createUser }= require("../models/users");
const { getJwtToken } = require("../config/util");

const signup= async ()=> {
    try{
        let user= await getUser(req.body.identifier);
        if(user) {
            res.status(400).json({status: 400, message: "User already existed with this email/mobile number"})
        } else {
            user = await createUser({name: req.body.name, email: req.body.identifier})
        }
    }catch(err) {
        res.status(400).json({status: 400, message: err.message})
    }
}

const login= async (req, res)=> {
    try{
        let user= await getUser(req.body.identifier)
        if(user) {
            let otp= Math.floor(1000 + Math.random() * 9000);
            myCache.set(user._id, otp, 1000*10)
            res.status(200).json({status: 200, message: "OTP sent to your registered email", data: {id: user._id, otp: otp}})
        } else {
            res.status(400).json({status: 400, message: "Sorry!, We are unable to find your details."})
        }
    }catch(err) {
        res.status(400).json({status: 400, message: err.message})
    }
}

const verifyToken= async (req, res)=> {
    try{
        let user= await getUser(req.body.userId);
        if(user){
            let otp= myCache.take(user._id);
            if(otp) {
                if(otp == req.body.token){
                    let token= getJwtToken({userId: user._id, role: user.role, name: user.name})
                    res.status(200).json({status: 200, message: "Logged in successfully", data: token})
                } else {
                    myCache.set(user._id, otp, 1000*10);
                    res.status(400).json({status: 400, message: "Provided OTP is invalid/expired"})
                }
            } else {
                res.status(400).json({status: 400, message: "Provided OTP is invalid/expired"})
            }
        }else {
            res.status(400).json({status: 400, message: "Sorry!, We are unable to find your details."})
        }
    }catch(err) {
        res.status(400).json({status: 400, message: err.message})
    }
}

module.exports= {
    login: login,
    signup: signup,
    verifyToken: verifyToken
}