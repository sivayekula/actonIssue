const Issue= require("../schemas/issue");


const getIssues= async (isuId)=> {
    try{
        if(isuId){
            let issue= await Issue.findOne({$or:[{_id: isuId}, {hashId: isuId}]})
            return issue
        } else {
            let issues= await Issue.find({})
            return issues
        }
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