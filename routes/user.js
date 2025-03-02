const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap.js')
const passport = require('passport');
const { saveRedirectUrl } = require("../loggedin.js");

const userController = require('../controllers/users.js')

// signup

router.get("/signup", userController.renderSignUp);

router.post("/signup", asyncWrap(userController.postSignUp))

// login

router.get("/login", userController.renderLogIn);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', {
       failureRedirect: "/login",
       failureFlash: true
    }), 
    asyncWrap(userController.postLogIn));

// logout user

router.get("/logout", userController.logout)

module.exports = router;

 