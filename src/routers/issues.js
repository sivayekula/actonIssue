const express = require('express');
const { verifyToken } = require('../middlewares/tokenValidator');
const { createissue, getissue, issuesList, getMyIssues, getHotIssues } = require('../controllers/issues');
const router = express.Router();

router.use(express.json())

router.get('/getIssue/:issueId', getissue)
router.get("/getMyIssues/:userId", verifyToken, getMyIssues)
router.get('/getIssues', issuesList)
router.post('/create', verifyToken, createissue)
router.get("/getHotIssues", getHotIssues)

module.exports = router