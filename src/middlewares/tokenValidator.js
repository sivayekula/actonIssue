const config = require('../config/config')
const jwt= require("jsonwebtoken")

const issueToken = (data) => {
    let token = jwt.sign(data, config.JWT_SECRET, { expiresIn: '1h' })
    return token;
}

const verifyToken = async (req, res, next) => {
    let token = req.headers.authorization.replace(/^Bearer\s+/, "");
    if(token) {
        try {
            let decoded = await jwt.verify(token, config.JWT_SECRET)
            req.user = decoded
            next()
        } catch(error) {
            res.status(401).json({success: false, message: "Provided Authorization token is expired / Invalid"})
        }
    }else {
        res.status(401).json({success: false, message: "This endpoint required valid Authorization token"})
    }
}

module.exports = {
    issueToken: issueToken,
    verifyToken: verifyToken
}