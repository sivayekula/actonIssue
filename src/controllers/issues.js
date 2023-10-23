"use strict";
const fs= require("fs")
const path= require("path")
const { getIssues, saveIssue, getIssue } = require("../models/issues")
const uniqid= require("uniqid");

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
        let filter={}//{isActive: true}
        if(req.params.startDate) filter["created_at"]= {$gte: req.params.startDate}
        if(req.params.endDate) filter["created_at"]= {$lte: req.params.endDate}
        if(req.params.status) filter["status"]= req.params.status
        let issue= await getIssues(filter, req.query.page ? req.query.page : 0)
        res.status(200).json({sucess: true, message: "List of issues", data: issue[0].result, total: issue[0].count ? issue[0].count.count : 0})
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
        let isuObj= {hashId:uniqid.process("#"), title: req.body.title, description: req.body.description, images: imgs, address: address, location: { type: 'Point', coordinates:[address.lat_lng.lat, address.lat_lng.lng]}, categoryId: req.body.category, userId: req.user.userId}
        let issue= await saveIssue(isuObj)
        res.status(200).json({sucess: true, message: "Issue created successfully", data: issue})
    }catch(err) {
        console.log(err)
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
    createissue: createissue,
    issuesList: issuesList
}