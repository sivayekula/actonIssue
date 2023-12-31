"use strict";
const NodeCache= require( "node-cache" );
const axios= require('axios');
const myCache= new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const { getUser, createUser, userLogin, updateUserDetails }= require("../models/users");
const validator = require('validator');
const fs = require('fs')
const path = require('path')
const { Vonage } = require('@vonage/server-sdk')
const nodemailer = require("nodemailer");
const { issueToken } = require("../middlewares/tokenValidator");
const bcrypt = require('bcrypt');
const imagePath= "../uploads/users/";
const admin = require("firebase-admin");
const serviceAccount = require("../actonissue-firebase.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://actonissue.firebaseio.com',
});

const signup= async (req, res)=> {
    try{
        let user= await userLogin(req.body.loginId);
        if(user && user.is_verified) {
            res.status(400).json({success: false, message: "User already existed with this email or mobile number"})
        } else {
            let isEmail= await validator.isEmail(req.body.loginId)
            let userObj;
            if(!user){
                if(isEmail) {
                    userObj= {name: req.body.name, email: req.body.loginId, password: req.body.password}
                } else {
                    userObj= {name: req.body.name, mobile: req.body.loginId, password: req.body.password}
                }
                user = await createUser(userObj)
            }
            let token= await genarateOTP()
            await sendOtp(token, user._id, req.body.loginId, isEmail)
            res.status(200).json({success: true, message: `Otp sent to ${req.body.loginId} successfully`, data: {userId: user._id}})
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
            let isMatch= await bcrypt.compare(req.body.password, user.password)
            if(isMatch) {
                let token= issueToken({userId: user._id, role: user.role, name: user.name})
                res.status(200).json({success: true, message: "Logged in successfully", data: token})
            } else {
                res.status(400).json({success: false, message: "Provided user name or password is wrong"})
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
        let user= await getUser(req.body.userId);
        if(user){
            let otp= await getCache(user._id);
            if(otp) {
                if(otp*1 == req.body.token*1){
                    await updateUserDetails({is_verified: true}, user._id)
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

const updateUser= async (req, res)=> {
    try{
        let user= await getUser(req.user.userId);
        let userObj= {}
        if(user) {
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
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "siva.yekula@gmail.com", // Your Ethereal Email address
                  pass: "bbxg ipvl rwhy gwdu", // Your Ethereal Email password
                }
              });
              let info = await transporter.sendMail({
                from: 'siva.yekula@gmail.com',
                to: notificationSource, // Test email address
                subject: "Verify your account",
                html: "Please use OTP :<strong>"+otp+"</strong> to verify your email.",
              });
              console.log("Message sent: %s", info.messageId); // Output message ID
        } else { 
            var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
    'method': 'POST',
    'hostname': 'n8d648.api.infobip.com',
    'path': '/sms/2/text/advanced',
    'headers': {
        'Authorization': 'App 6c8f41c323319f119d3c5faabe1b5870-141de17d-34a2-4061-9b3e-cd158b68b873',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    'maxRedirects': 20
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });

    res.on("error", function (error) {
        console.error(error);
    });
});

var postData = JSON.stringify({
    "messages": [
        {
            "destinations": [
                {
                    "to": "91"+notificationSource
                }
            ],
            "from": "InfoSMS",
            "text": "This is a sample message"+otp
        }
    ]
});

req.write(postData);

req.end();
            // const apiKey = "NjE3NDU4NDU1ODc5NmI3ODU2NmI0NzM1N2E3YTU0NmY=" 
            // const sender = "Act On Issue"
            // let number = "91"+notificationSource
            // let applicationName = "ActOnIssue"
            // let otp = "123123"
            // let message = encodeURIComponent(`Welcome to ${applicationName}, Your OTP is ${otp}. Thanks Act On Issue`);
            // let url = "http://api.textlocal.in/send/?" + 'apiKey=' + apiKey + '&sender=' + sender + '&numbers=' + number + '&message=' + message
            // let response= await axios.post(url)
            // console.log(response.data)
        }
        setCache(userId, otp)
    }catch(err){
        console.log(err)
        console.log(otp, userId, notificationSource, isEmail)
        throw new Error(err.message ? err.message : "Unable to send email or sms")
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
    updateUser: updateUser
}