module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', "Logging in is required!");
        res.redirect("/login");
    } else {
        next();
    }
}

// module.exports.sessionResetcheck = (req, res, next) => {
//     console.log(req.session.redirectUrl);
//     next();
// }

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
}