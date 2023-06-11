const express = require('express');
const router = express.Router();

router.use(express.json())

router.get('/getCategory', (req, res)=> {
    res.json({status: 200, message: "server is running"})
})

module.exports = router