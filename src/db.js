const mongoose = require('mongoose');
const uri= "mongodb+srv://sivayekula:wCEg7WKN8fPyIUXY@cluster0.wyjtxzo.mongodb.net/actonissue?retryWrites=true&writeConcern=majority";

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("DB connected successfully");
});

module.exports = db