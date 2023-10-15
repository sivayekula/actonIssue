const Issue= require("../schemas/issue");


const getIssues= async (issueFilter)=> {
    try{
        let issues= await Issue.find(issueFilter)
        return issues
    }catch(err) {
        throw err
    }
}
const getIssue= async (isuId)=> {
    try{
        let issue= await Issue.findOne({$or:[{_id: isuId}, {hashId: isuId}]})
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

module.exports= {
    getIssues: getIssues,
    saveIssue: saveIssue
}