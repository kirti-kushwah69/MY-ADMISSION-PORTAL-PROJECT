const ContactModel = require('../models/contact');
class ContactController {
    static contactInsert = async (req, res) => {
        try {
            // console.log(req.body)
            const { id } = req.userdata
            const { name, email, phone, message } = req.body
            if (!phone || !message) {
                req.flash("error", "All fields are Required.");
                return res.redirect("/contact");
            }
            const result = new ContactModel({
                name: name,
                email: email,
                phone: phone,
                message: message,
                user_id: id
            })
            await result.save()
            req.flash('success', 'Thanks for Contact us')
            res.redirect('/contact')
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = ContactController