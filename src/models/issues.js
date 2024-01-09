const Issue= require("../schemas/issue");
const config= require("../config/config");


const getIssues= async (issueFilter, page = 1, pageSize = 1)=> {
    try{
        let documents= await Issue.find(issueFilter).sort({created_at: -1}).populate("categoryId").populate("userId")  //.skip(skip).limit(pageSize) for pagination
        return documents
    }catch(err) {
        throw err
    }
}
const getIssue= async (isuId)=> {
    try{
        let issue= await Issue.findOne({$or:[{_id: isuId}, {hashId: isuId}]}).populate("categoryId").populate("userId")
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