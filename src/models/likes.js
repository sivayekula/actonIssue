"use strict";
const Flag= require("../schemas/flag")


const saveFlag= async (flagObj)=> {
    try{
        let flag= await new Flag(flagObj).save();
        return flag
    }catch(err){
        throw err
    }
}

const getFlags= async (flagId)=> {
    try{
        let flags= await Flag.find({$or:[{_id: flagId}, {userId: flagId}, {issueId: flagId}]});
        return flags
    }catch(err){
        throw err
    }
}

const getFlagsCount= async (flagId)=> {
    try{
        let flagsCount= await Flag.count({$or:[{_id: flagId}, {userId: flagId}, {issueId: flagId}]});
        return flagsCount
    }catch(err){
        throw err
    }
}

module.exports= {
    saveFlag: saveFlag,
    getFlags: getFlags,
    getFlagsCount: getFlagsCount
}