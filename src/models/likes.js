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

const getFlag= async (filter)=> {
    try{
        let flags= await Flag.findOne(filter);
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

const updateFlag= async (id, flagObj)=> {
    try{
        let flag= await Flag.findByIdAndUpdate(id, flagObj, {new: true})
        return flag
    } catch(err){
        throw err
    }
}

module.exports= {
    saveFlag: saveFlag,
    getFlag: getFlag,
    getFlagsCount: getFlagsCount,
    updateFlag: updateFlag
}