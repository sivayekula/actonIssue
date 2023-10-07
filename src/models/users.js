"use strict";
const User= require("../schemas/user");

const userLogin= async (identifier)=> {
    try{
        let user= await User.findOne({$or:[{email: identifier}, {mobile: identifier}]})
        return user;
    }catch(err) {
        throw err
    }
}

const getUser= async (userId)=> {
    try{
        let user= await User.findOne({_id: userId})
        return user;
    }catch(err) {
        throw err
    }
}

const createUser= async (requestBody)=> {
    try{
        let user= await new User(requestBody).save();
        return user
    }catch(err) {
        throw err
    }
}


module.exports= {
    getUser: getUser,
    createUser: createUser,
    userLogin: userLogin
}