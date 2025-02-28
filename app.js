const express = require("express");
const app = express();
const port = 3000;
const web = require('./routing/web')
const {connect} = require('mongoose')
const connectDb = require('./db/connectDb')



//ejs setup a.ejs
app.set('view engine','ejs')

//css image setuplink
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
//connection session and flash
const session = require('express-session')
const flash = require('connect-flash');
//session messages
app.use(session({
    secret :'secret',
    cookie : {maxAge:60000},
    resave : false,
    saveUninitialized: false,
}))
//flash messages
app.use(flash());

//images upload setup
const fileUpload = require("express-fileupload");
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp'
}))
//cookie-parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())


//database connection
connectDb()

//localhost:3000
//router load
app.use('/',web)

//server create
app.listen(port,console.log("Server start localhost:3000"));