const mongoose = require('mongoose')
// const Local_Url = "mongodb://127.0.0.1:27017/AdmissionPortalProject1";
const Live_Url = 'mongodb+srv://kirtikushwah906:8Pi6xG0wJ2a93prR@cluster0.cki18.mongodb.net/AdmissionPortalProject1?retryWrites=true&w=majority&appName=Cluster0'
const connectDb = ()=>{
    return mongoose.connect(Live_Url)
    .then(()=>{
        console.log('connect db')
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports = connectDb