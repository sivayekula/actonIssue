const config = require('../config/config')

const issueToken = (data) => {
    let token = jwt.sign({
        user: data
    }, config.secret, { expiresIn: '1h' })
    return token;
}

const verifyToken = async (req, res, next) => {
    let token = req.headers.authorization
    if(token) {
        try {
            let decoded = await jwt.verify(token, config.secret)
            req.user = decoded
            next()
        } catch(error) {
            res.status(401).json({message: "Provided Authorization token is expired / Invalid"})
        }
    }else {
        res.status(401).json({message: "This endpoint required valid Authorization token"})
    }
}

module.exports = {
    issueToken: issueToken,
    verifyToken: verifyToken
}