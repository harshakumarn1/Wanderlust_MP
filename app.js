if( process.env.NODE_ENV != "production" ) {
    require('dotenv').config(); // only used while development stage
}
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const CustomErrorClass = require('./utils/customErrorClass.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");


const listings = require('./routes/listing.js');
const reviews = require("./routes/review.js");
const users = require('./routes/user.js');

const mongoAtlasDBurl = `${process.env.MONGO_ATLAS_DB_URL}`;

const mongoose = require('mongoose');
async function main(){
    await mongoose.connect(mongoAtlasDBurl);
};
main().then(() => {
    console.log("node.js connected with wanderlast database of MongoDB");
}).catch((err) => {
    console.log(err);
});

app.set("view engine","ejs");
app.engine("ejs", ejsMate);

app.use( (req, res, next) => {
    res.locals.originalUrl = req.originalUrl;
    // console.log(res.locals.originalUrl);
    next();
} )


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
const store = MongoStore.create({
    mongoUrl: mongoAtlasDBurl,
    touchAfter: 24*60*60,
    crypto: {
        secret: `${process.env.SECRET}`
    }
})

store.on("error", () => {
    console.log("Error in Mongo Session Store", err)
});

const sessionOptions = {
    store: store,
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use( session(sessionOptions) );
app.use( flash() );

app.use( passport.initialize() );
app.use( passport.session() );

passport.use( new LocalStrategy( User.authenticate() ) );

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( (req, res, next) => {
    res.locals.nlsuccess = req.flash("nlsuccess");
    // console.log(res.locals.nlsuccess);
    res.locals.nldelete = req.flash("nldelete");
    res.locals.reviewsuccess = req.flash("reviewsuccess");
    res.locals.reviewdelete = req.flash("reviewdelete");
    res.locals.registerSuccess = req.flash("registerSuccess");
    res.locals.signupError = req.flash("signupError");
    res.locals.loginSuccess = req.flash("loginSuccess");
    res.locals.error = req.flash("error");
    res.locals.logout = req.flash("logout");
    res.locals.currentUser = req.user;
    res.locals.wrongOwner = req.flash('wrongOwner');
    res.locals.reviewDelete = req.flash('reviewDelete');
    next();
} )
// app.use(express.static("public/css"));


app.listen(8080 , () => {
    console.log("Server Started");
    console.log("API req's Listening started at port 8080");
});

// app.get("/", (req , res) => {
//     res.send("get req came to root path");
// });

// app.get("/demouser", async (req, res) => {

//    const fakeUser =  new User({
//         email:"harsha123@gmail.com",
//         username: "harsha123"
//     })
   
//     const registeredUser = await User.register(fakeUser, "agni123");
//     res.send(registeredUser);

// })

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);
app.use("/", users)

// app.get("/testlisting", async (req , res) => {
//     // let sampleListing = new Listing({
//     //     title:"My new villa",
//     //     description:"near beach",
//     //     price:3000,
//     //     location:"calangute , goa",
//     //     country:"india"
//     // })
//     // await sampleListing.save().then((res) => {
//     //     console.log(res);
//     // }).catch((err) => {
//     //     console.log(err);
//     // });
//     // console.log("document was saved");
//     res.send("sample listing ready to list");
// });


app.all("*", (req, res, next) => {
    next(new CustomErrorClass(404, "Page Not Found!"));
});

// Error handling middleware

app.use( (err, req, res, next) => {
    // console.log("EHM");
    let {status = 500, message = "Something Went Wrong!"} = err;
    // res.status(status).send(message);
    // console.log(message);
    res.render("listings/error.ejs",{message});
});

