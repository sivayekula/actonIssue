"use strict";
const fs= require("fs")
const path= require("path")
const { getIssues, saveIssue, getIssue, updateIssueDetails } = require("../models/issues")
const uniqid= require("uniqid");
const { getComments, getCommentsCount } = require("../models/comments");
const { getFlags, getFlagsCount } = require("../models/likes");
const moment = require('moment-timezone');

const getissue= async (req, res)=> {
    try{
        let isuId= req.params.issueId;
        if(isuId) {
            let issue= await getIssue(isuId)
            res.status(200).json({sucess: true, message: "Issue details", data: issue})
        }else {
            res.status(400).json({sucess: false, message: "Issue id is required"})
        }
    }catch(err) {
        res.status(400).json({sucess: false, message: err.message})
    }
}

const issuesList= async (req, res)=> {
    try{
        let issuesData= []
        let filter={}
        if(req.query.startDate && req.query.endDate) filter["created_at"]= {$gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate)}
        if(req.query.status) filter["status"]= req.query.status == "All" ? {$ne: "created"} : req.query.status == "Open" ? "approved" : req.query.status.toLowerCase()
        if(req.query.lat && req.query.lng){
            const maxDistance = 5000;
            filter['location']= { 
                $near: {
                    $geometry: {
                        type: "Point" ,
                        coordinates: [req.query.lat*1, req.query.lng*1] 
                    },
                    $maxDistance : maxDistance
                }
            }
        }
        let documents= await getIssues(filter)
        for(let i= 0; i< documents.length; i++) {
            let comments= await getCommentsCount(documents[i]._id)
            let flags= await getFlagsCount(documents[i]._id)
            issuesData.push({...documents[i]._doc, commentsCount: comments, flagsCount: flags})
        }
        res.status(200).json({sucess: true, message: "List of issues", data: issuesData})
    }catch(err) {
        res.status(400).json({sucess: false, message: err.message})
    }
}

const createissue= async (req, res)=> {
    try{
        let address= req.body.address
        let images= req.body.images
        let imgs=[]
        for(let i= 0; i< images.length; i++){
            let matches = images[i].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);  
            if (matches.length !== 3) 
            {
              return new Error('Invalid input string');
            }
            let type = matches[1];
            let data = Buffer.from(matches[2], 'base64');
            let imageType= /\/(.*?)$/;
            let imageExt= type.match(imageType);
            let name= Date.now()+"."+imageExt[1];
            let imgPath= "../uploads/issues/"+name
            imgs.push(name)
            await saveImage(data, imgPath)
        }
        let isuObj= {hashId:uniqid.process("#"), title: req.body.title, description: req.body.description, images: imgs, address: address, location: { type: 'Point', coordinates:[address.lat_lng.lat, address.lat_lng.lng]}, categoryId: req.body.category, otherCategory: req.body.other, isSwatchBharat: req.body.isSwathyaBharat, userId: req.user.userId}
        let issue= await saveIssue(isuObj)
        res.status(200).json({sucess: true, message: "Issue created successfully", data: issue})
    }catch(err) {
        console.log(err)
        res.status(400).json({sucess: false, message: err.message})
    }
}

const getUserIssues= async (req, res)=> {
    try{
        let documents= await getIssues({userId: req.params.userId})
        res.status(200).json({sucess: false, message: "user issues", data: documents})
    } catch(err){
        res.status(400).json({sucess: false, message: err.message})
    }
}

const updateIssue= async (req, res)=> {
    try {
        let issue= await getIssue(req.body.issueId);
        let issueObj= {}
        if(issue) {
            if(req.body.status) {
                issueObj['status']= req.body.status
            }
        }
        let updatedIssue= await updateIssueDetails(issue._id, issueObj)
        res.status(200).json({sucess: true, message: "Issue status updated successfully", data: updatedIssue})
    }catch(err){
        res.status(400).json({sucess: false, message: err.message})
    }
}

async function saveImage(img, filePath) {
    try{
        await fs.promises.writeFile(path.join(__dirname, filePath), img);
        return "success"
    }catch(err) {
        throw err
    }
}

module.exports = {
    getissue: getissue,
    getMyIssues: getUserIssues,
    createissue: createissue,
    issuesList: issuesList,
    updateIssue: updateIssue
}