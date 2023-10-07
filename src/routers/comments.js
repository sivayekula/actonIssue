const express = require('express');
const { commentsList, createComment, commentsCount } = require('../controllers/comments');
const { verifyToken } = require('../middlewares/tokenValidator');
const router = express.Router();

router.use(express.json())

router.get('/getComments/:commentId', verifyToken, commentsList)
router.get('/getCommentsCount/:commentId', commentsCount)
router.post('/createComment', verifyToken, createComment)

module.exports = router