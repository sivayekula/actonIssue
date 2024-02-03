const Issue= require("../schemas/issue");
const config= require("../config/config");


const getIssues= async (issueFilter)=> {
    try{
        // let documents= await Issue.aggregate([
        //     // locFilter,
        //     {
        //         $lookup: {
        //             from: "comments",
        //             localField: "_id",
        //             foreignField: "issueId",
        //             as: "comments"
        //         }
        //     },{
        //         $lookup: {
        //             from: "flags",
        //             localField: "_id",
        //             foreignField: "issueId",
        //             pipeline: [
        //                 {
        //                     $match: {"isLiked": true}
        //                 }
        //             ],
        //             as: "flags"
        //         }
        //     },{
        //         $lookup: {
        //             from: "views",
        //             localField: "_id",
        //             foreignField: "issueId",
        //             as: "views"
        //         }
        //     }, {
        //         $match: issueFilter
        //     }
        // ])
        let documents= await Issue.find(issueFilter).sort({created_at: -1}).populate("categoryId").populate("userId", "name")  //.skip(skip).limit(pageSize) for pagination
        return documents
    }catch(err) {
        throw err
    }
}
const getIssue= async (isuId)=> {
    try{
        let issue= await Issue.findOne({$or:[{_id: isuId}, {hashId: isuId}]}).populate("categoryId").populate("userId", "name")
        return issue
    }catch(err) {
        throw err
    }
}

const saveIssue= async (isuObj)=> {
    try{
        let issue= await new Issue(isuObj).save()
        return issue
    }catch(err) {
        throw err
    }
}

const updateIssueDetails= async (id, issueObj)=> {
    try{
        let issue= await Issue.findByIdAndUpdate(id, issueObj, {new: true})
        return issue
    } catch(err){
        throw err
    }
}

module.exports= {
    getIssues: getIssues,
    saveIssue: saveIssue,
    getIssue: getIssue,
    updateIssueDetails: updateIssueDetails
}