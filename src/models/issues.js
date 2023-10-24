const Issue= require("../schemas/issue");
const config= require("../config/config");


const getIssues= async (issueFilter, currentPage)=> {
    try{
        const proximity= 1000;
        const skip = currentPage * config.ISSEUS_PER_PAGE - config.ISSEUS_PER_PAGE;
        const query = [
            // {
            //     $geoNear: {
            //         includeLocs: "location",
            //         distanceField: "distance",
            //         near: {type: 'Point', coordinates: ['17.4833526', "78.3870668"]},
            //         maxDistance: 1000,
            //         spherical: true
            //     }
            // },
            {
                $match: {location: {$geoWithin: {$center: [[16.8913007, 81.9386293], 1]}}}
            },{
                $sort: {
                    created_at: -1
                }
            },{ 
                $lookup: {from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'categoryId'} 
            },{
                $facet: {
                    result: [
                        // {
                        //     $project: {
                        //         created_at: 0,
                        //         updated_at: 0,
                        //         __v: 0
                        //     }
                        // }
                    ],
                    count: [
                        {
                            $count: "count"
                        }
                    ]
                }
            },{
                $project: {
                    result: 1,
                    count: {
                        $arrayElemAt: ["$count", 0]
                    }
                }
            }
        ];
        let documents= await Issue.aggregate(query)
        return documents
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
    saveIssue: saveIssue,
    getIssue: getIssue
}