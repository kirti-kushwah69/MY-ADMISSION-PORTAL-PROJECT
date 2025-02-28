const CourseModel = require('../models/course')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
cloudinary.config({
  cloud_name: "du2hhlitq",
  api_key: "976554984292812",
  api_secret: "WMX-1zftFyKY-Fl3Qf1qbEq_3T0", // Click 'View API Keys' above to copy your API secret
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mba = await CourseModel.findOne({ user_id: id, course: "mba" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      const mtech = await CourseModel.findOne({ user_id: id, course: "mtech" });
      const bsc = await CourseModel.findOne({ user_id: id, course: "bsc" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mba: mba,
        mca: mca,
        mtech: mtech,
        bsc: bsc,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, email, image } = req.userdata;
      res.render("contact", { n: name, e: email, i: image, msg: req.flash("success"), message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash("error"), msg: req.flash("success") });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", {
        message: req.flash("success"),
        msg: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  //insert data
  static insertStudent = async (req, res) => {
    try {
      // console.log(req.body)

      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        req.flash("error", "All fields are required.");
        return res.redirect("/register");
      }

      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Email Already Exists.");
        return res.redirect("/register");
      }

      if (password != confirmpassword) {
        req.flash("error", "Password does not match.");
        return res.redirect("/register");
      }

      // console.log(req.files)
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload);

      const hashpassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      if (data) {
        //token create
        let token = jwt.sign({ ID: data._id }, "dfgfrgr5452455");
        // console.log(token)
        res.cookie("token", token);
        //sendverifymail
        this.sendVerifymail(name, email, data._id);
        //to redirect to login page
        req.flash("success", "Your Registration has been successfully.Please verify your mail.");
        res.redirect("/register");
      } else {
        req.flash("error", "Not Register.");
        res.redirect("/register")
      }
      req.flash("success", "Register Success ! Plz Login.");

      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  //send verify mail
  static sendVerifymail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "kirtikushwah906@gmail.com",
        pass: "lxdefvorboirbsjt",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };

  //verify mail
  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //verify login
  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatched = await bcrypt.compare(password, user.password);
        // console.log(isMatched)

        if (isMatched) {
          // if (user.role == 'admin') {
          //   //token create
          //   let token = jwt.sign({ ID: user._id }, "dfgfrgr5452455");
          //   // console.log(token)
          //   res.cookie("token", token);

          //   res.redirect("/admin/dashboard");
          // }
          // if (user.role == 'student') {
          //   //token create
          //   let token = jwt.sign({ ID: user._id }, "dfgfrgr5452455");
          //   // console.log(token)
          //   res.cookie("token", token);

          //   res.redirect("/home");
          // }
          if (user.role == "admin" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, 'dfgfrgr5452455');
            // console.log(token)
            res.cookie('token', token)
            res.redirect('/admin/dashboard')
          } else if (user.role == "student" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, 'dfgfrgr5452455');
            // console.log(token)
            res.cookie('token', token)
            res.redirect('/home')
          }
          else {
            req.flash("error", "Please verify your email.")
            res.redirect('/')
          }

        } else {
          req.flash("error", "Email or password is not valid.");
          return res.redirect("/");
        }
      } else {
        req.flash("error", "You are not a registered user");
        return res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
//logout
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  //profile
  static profile = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      res.render('profile', { n: name, i: image, e: email })
    } catch (error) {
      console.log(error);
    }
  };
  //changepassword
  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      // console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //updateprofile
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  
  // Forget password verify
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body
      const userData = await UserModel.findOne({ email: email })
      // console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!")
        res.redirect("/")
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/")
      }
    } catch (error) {
      console.log(error)
    }
  }

  static sendEmail = async (name, email, token) => {
    //console.log(name,email,status,commemt)
    //connect with smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "kirtikushwah906@gmail.com",
        pass: "lxdefvorboirbsjt",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com",  //sender addresss
      to: email, //list of receivers
      subject: "Reset Password",  //subject line
      text: "heelo", //plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };


  //reset password
  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error)
    }

  }

  //reset password1
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

}
module.exports = FrontController