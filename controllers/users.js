const User = require('../models/user.js');

module.exports.renderSignUp = async (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.postSignUp = async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({
            username: username,
            email: email
        })
    
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        await req.logIn(registeredUser, (err) => {
            console.log(req.user);
            if(err) {
                return next(err);
            }
            req.flash("registerSuccess", "Welcome to Wanderlast!");
            res.redirect("/listings");
        });

    } catch (error) {
        req.flash('signupError', `${error.message}`);
        res.redirect("/signup");
    }
};

module.exports.renderLogIn = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.postLogIn = async (req, res) => {
    // console.log(req.session.redirectUrl);
    // console.log(res.locals.redirectUrl);
req.flash('loginSuccess', "Welcome to Wanderlast!")
let redirectUrl = res.locals.redirectUrl || "/listings"
res.redirect(redirectUrl);

};

module.exports.logout = async (req, res) => {
    console.log(req.user);
    console.log(req.session);
    req.logOut((err) => {
        if(err) {
            next(err);
        }
        req.flash('logout', "logged Out Successfully!");
        console.log(req.session);
        res.redirect("/listings"); 
    })
};