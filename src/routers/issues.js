const express = require('express');
const { verifyToken } = require('../middlewares/tokenValidator');
const { createissue, getissue, issuesList } = require('../controllers/issues');
const router = express.Router();

router.use(express.json())

router.get('/getIssue/:issueId', getissue)
router.get('/getIssues', issuesList)
router.post('/create', verifyToken, createissue)

module.exports = router