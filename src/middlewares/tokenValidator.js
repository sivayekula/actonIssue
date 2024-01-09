const config = require('../config/config')
const jwt= require("jsonwebtoken")

const issueToken = (data) => {
    try {
        let token = jwt.sign(data, config.JWT_SECRET)
        return token;
    }catch(err) {
        throw err
    }
}

const verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.replace(/^Bearer\s+/, "");
        if(token) {
            let decoded = jwt.verify(token, config.JWT_SECRET)
            req.user = decoded
            next()
        }else {
            res.status(401).json({success: false, message: "This endpoint required valid Authorization token"})
        }
    } catch(error) {
        res.status(401).json({success: false, message: "Provided Authorization token is expired / Invalid"})
    }
}

const sessionChecker = (req, res, next) => {    
    // console.log(`Session Checker: ${req.session.token}`);
    if (req.session.token) {
        try {
            let decoded = jwt.verify(req.session.token, config.JWT_SECRET)
            req.user= decoded;
            next();
        }catch(err) {
            res.redirect('/admin');
        }
    } else {
        // console.log(`No User Session Found`);
        res.redirect('/admin');
    }
};


module.exports = {
    issueToken: issueToken,
    verifyToken: verifyToken,
    sessionChecker: sessionChecker
}