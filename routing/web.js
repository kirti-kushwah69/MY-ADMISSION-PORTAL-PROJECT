const express = require('express')
const FrontController = require('../controllers/FrontController')
const AdminController = require('../controllers/admin/AdminController')
const route = express.Router()
const checkAuth = require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const ContactController = require('../controllers/ContactController')
const adminrole = require('../middleware/admin_role')
const isLogin = require('../middleware/islogin')

//Front Controller
route.get('/home', checkAuth, FrontController.home)
route.get('/about', checkAuth, FrontController.about)
route.get('/contact', checkAuth, FrontController.contact)
route.get('/register', FrontController.register)
route.get('/', isLogin, FrontController.login)
//insert data
route.post('/insertStudent', FrontController.insertStudent)
//verifylogin
route.post('/verifyLogin', FrontController.verifyLogin)
route.get('/logout', checkAuth, FrontController.logout)
route.get("/profile",checkAuth, FrontController.profile);
route.post("/changePassword",checkAuth,FrontController.changePassword)
route.post('/updateProfile', checkAuth, FrontController.updateProfile)

//Admin Controller
route.get('/admin/dashboard', checkAuth, adminrole('admin'), AdminController.dashboard)
route.get('/admin/studentDisplay', checkAuth, adminrole('admin'), AdminController.studentDisplay)
route.get('/admin/studentView/:id', checkAuth, adminrole('admin'), AdminController.studentView);
route.get("/admin/studentEdit/:id", checkAuth, adminrole('admin'), AdminController.studentEdit);
route.post("/admin/studentUpdate/:id", checkAuth, adminrole('admin'), AdminController.studentUpdate);
route.get("/admin/studentDelete/:id", checkAuth, adminrole('admin'), AdminController.studentDelete);
//insert data
route.post("/admin/insertStudent", checkAuth, adminrole('admin'), AdminController.studentInsert)
route.get('/admin/courseDisplay', checkAuth, adminrole('admin'), AdminController.courseDisplay)
route.post('/update_status/:id', checkAuth, adminrole('admin'), AdminController.update_status)
//contact display on admin
route.get("/admin/contactDisplay", checkAuth, adminrole('admin'), AdminController.contactDisplay);
//profile
route.get('/admin/profile', checkAuth, adminrole('admin'), AdminController.profile)
route.post("/admin/updateProfile", checkAuth, adminrole('admin'), AdminController.updateProfile);
//password
route.get('/admin/password', checkAuth, adminrole('admin'), AdminController.password)
route.post("/admin/changePassword", checkAuth, adminrole('admin'), AdminController.changePassword);


//Contact Controller
route.post("/contactInsert", checkAuth, ContactController.contactInsert)

//CourseController
route.post('/course_insert', checkAuth, CourseController.courseinsert)
route.get("/coursedisplay", checkAuth, CourseController.coursedisplay);
route.get("/courseView/:id", checkAuth, CourseController.courseView);
route.get("/courseEdit/:id", checkAuth, CourseController.courseEdit);
route.post("/courseUpdate/:id", checkAuth, CourseController.courseUpdate)
route.get("/courseDelete/:id", checkAuth, CourseController.courseDelete);

//forgot password
route.post('/forgot_Password', FrontController.forgetPasswordVerify)
route.get('/reset-password', FrontController.reset_Password)
route.post('/reset_Password1', FrontController.reset_Password1)

//verifymail
route.get('/verify', FrontController.verifyMail)

module.exports = route