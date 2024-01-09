"use strict";
const NodeCache= require( "node-cache" );
const axios= require('axios');
const myCache= new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const { getUser, createUser, userLogin, updateUserDetails, listOfUsers}= require("../models/users");
const validator = require('validator');
const fs = require('fs')
const path = require('path')
const nodemailer = require("nodemailer");
const { issueToken } = require("../middlewares/tokenValidator");
const bcrypt = require('bcrypt');
const imagePath= "../uploads/users/";

const signup= async (req, res)=> {
    try{
        let user= await userLogin(req.body.loginId);
        if(user && user.is_verified) {
            res.status(400).json({success: false, message: "User already existed with this mobile number"})
        } else {
            let userObj;
            if(!user){
                userObj= {name: req.body.name, mobile: req.body.loginId, email: req.body.email, password: req.body.password}
                user = await createUser(userObj)
            }
            res.status(200).json({success: true, message: `User created`, data: {userId: user._id}})
        }
    }catch(err) {
        console.log(err)
        res.status(400).json({success: false, message: err.message})
    }
}

const login= async (req, res)=> {
    try{
        let user= await userLogin(req.body.loginId)
        if(user && user.is_verified) {
            if(user.status == "active") {
                let isMatch= await bcrypt.compare(req.body.password, user.password)
                if(isMatch) {
                    let token= issueToken({userId: user._id, role: user.role, name: user.name})
                    if(user.role == "admin"){
                        req.session.token = token
                        req.session.save()
                    }
                    res.status(200).json({success: true, message: "Logged in successfully", data: token})
                } else {
                    res.status(400).json({success: false, message: "Provided user name or password is wrong"})
                }
            } else {
                res.status(400).json({success: false, message: "Something went wrong. Please contact to admin"})
            }
        } else {
            res.status(400).json({success: false, message: "Please signup or verify your details"})
        }
    }catch(err) {
        res.status(400).json({success: false, message: err.message})
    }
}

const verifyOTP= async (req, res)=> {
    try{
        let {userId, is_verified} = req.body;
        let user= await getUser(userId);
        if(user){
            await updateUserDetails({is_verified}, user._id)
            let token= issueToken({userId: user._id, role: user.role, name: user.name})
            res.status(200).json({success: true, message: "Logged in successfully", data: token})
        }else {
            res.status(400).json({success: false, message: "Sorry!, We are unable to find your details."})
        }
    }catch(err) {
        res.status(400).json({success: false, message: err.message})
    }
}

const getuser= async (req, res)=> {
    try{
        if(req.user.userId){
            let user= await getUser(req.user.userId);
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

const getusers= async (req, res)=> {
    try{
        let users= await listOfUsers();
        res.status(200).json({success: true, message: "user details", data: users})
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

const updateUser= async (req, res)=> {
    try{
        let user= await getUser(req.body.userId || req.user.userId);
        let userObj= {}
        if(user) {
            if(req.body.status) {
                userObj['status']= req.body.status
            }
            if(req.body.name) {
                userObj['name']= req.body.name
            }
            if(req.body.profile_pic) {
                let imgName= await saveImage(req.body.profile_pic);
                userObj['profile_pic']= imgName
            }
            if(req.body.gender) {
                userObj['gender']= req.body.gender
            }
            if(req.body.address) {
                userObj['address']= req.body.address
            }
            if(req.body.identity_proof) {
                let proImg= await saveImage(req.body.identity_proof);
                userObj['identity_proof'] = proImg
            }
            let updatedUser= await updateUserDetails(userObj, user._id)
            res.status(200).json({success: true, message: "profile pic updated successfully", data: updatedUser})
        } else{
            res.status(400).json({success: false, message: "Unable to find user details"})
        }
    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

const saveImage= async (imageString) => {
    try{
        let matches = imageString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);  
        if (matches.length !== 3) throw new Error('Invalid image string');
        let type = matches[1];
        let data = Buffer.from(matches[2], 'base64');
        let imageType= /\/(.*?)$/;
        let imageExt= type.match(imageType);
        let name= Date.now()+"."+imageExt[1];
        let imgPath= imagePath+""+name
        await fs.promises.writeFile(path.join(__dirname, imgPath), data);
        return name
    }catch(err){
        throw err
    }
}

module.exports= {
    login: login,
    signup: signup,
    verifyOTP: verifyOTP,
    getuser: getuser,
    updateUser: updateUser,
    getusers: getusers
}