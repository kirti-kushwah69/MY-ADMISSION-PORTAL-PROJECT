const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

const isLogin = async (req, res, next) => {
    //console.log('hello middle ware)
    const { token } = req.cookies
    //console.log(token)
    if (token) {
        res.redirect('/home')
    }
    next()
}
module.exports = isLogin