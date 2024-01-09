const {saveFlag, getFlag, updateFlag}= require("../models/likes");


const saveFlagStatus= async (req, res)=> {
    try{
        console.log(req.body)
        let resp;
        let flag= await getFlag({userId: req.body.userId, issueId: req.body.issueId})
        if(flag) {
            resp= await updateFlag(flag._id, {isLiked: req.body.status})
        } else {
            resp= await saveFlag({userId: req.body.userId, issueId: req.body.issueId, isLiked: req.body.status})
        }
        res.status(200).json({success: true, message: "status saved successfully", data: resp})
    } catch(err) {
        res.status(400).json({success: false, message: err.message})
    }
}

module.exports= {
    saveFlagStatus: saveFlagStatus
}