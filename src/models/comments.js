"use strict";
const Comment= require("../schemas/comment")


const saveComment= async (comntObj)=> {
    try{
        let comment= await new Comment(comntObj).save();
        return comment
    }catch(err){
        throw err
    }
}

const getComments= async (comntId)=> {
    try{
        let comments= await Comment.find({$or:[{_id: comntId}, {userId: comntId}, {issueId: comntId}]}).populate("userId");
        return comments
    }catch(err){
        throw err
    }
}

const getCommentsCount= async (comntId)=> {
    try{
        let commentsCount= await Comment.count({$or:[{_id: comntId}, {userId: comntId}, {issueId: comntId}]});
        return commentsCount
    }catch(err){
        throw err
    }
}

module.exports= {
    saveComment: saveComment,
    getComments: getComments,
    getCommentsCount: getCommentsCount
}