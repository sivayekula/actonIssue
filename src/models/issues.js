const Issue= require("../schemas/issue");
const config= require("../config");


const getIssues= async (issueFilter, currentpage)=> {
    Issue.find({issueFilter}).count().then(count=>{
        Issue.aggregate().skip(currentpage).limit(config.ISSEUS_PER_PAGE).sort(-1).exec().then(documents=>{
            return {docs: documents, totalCount: count}
        })
    }).catch((error) => {
        throw error
    }).catch(err=> {
        throw err
    })
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
    saveIssue: saveIssue,
    getIssue: getIssue
}