const express = require('express');
const app = new express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const indexRouter = require('./routers/index');
const db = require('./db');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');
const flagRouter = require('./routers/flag');
const commentRouter = require('./routers/comments');
const issueRouter = require('./routers/issues');

//Express methods
app.use(express.urlencoded({extended: false}))

// cors
app.use(cors())
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next()
})

// routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/issue', issueRouter);
app.use('/comment', commentRouter);
app.use('/flag', flagRouter);


app.listen(port, ()=> {
    console.log(`server is running on :: ${port}`)
})

//catch 404 errors and forwarded to error handler
app.use((req, res, next)=> {
    res.status(404).send("Bad request/Invalid url")
})

// Default error handler
app.use((err, req, res, next)=>{
    res.status(err.status || 500).send(err.stack)
})


module.exports = app