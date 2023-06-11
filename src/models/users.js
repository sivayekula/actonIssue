"use strict";
const User= require("../schemas/user");

const getUser= async (identifier)=> {
    try{
        let user= await User.findOne({$or:[{_id: identifier}, {email: identifier}, {mobile: identifier}]})
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
    createUser: createUser
}