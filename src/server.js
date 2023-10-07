const express = require('express');
const app = new express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const indexRouter = require('./routers/index');
const db = require('./db');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');
const flagRouter = require('./routers/flag');
const commentRouter = require('./routers/comments');
const issueRouter = require('./routers/issues');
const newsRouter = require("./routers/news");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//Express methods
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// cors
app.use(cors())

// api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/issue', issueRouter);
app.use('/comment', commentRouter);
app.use('/flag', flagRouter);
app.use("/api/trandingNews", newsRouter)


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