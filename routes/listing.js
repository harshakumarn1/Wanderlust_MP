const express = require('express');
const router = express.Router();

const asyncWrap = require('../utils/asyncWrap.js')
const { isLoggedIn } = require("../loggedin.js");
const { checkOwner,  validateListing } = require('../routeMiddleware.js');
const multer = require('multer');
const storage = require('../cloudConfig.js');
const upload = multer( { storage } );

const listingsController = require("../controllers/listings.js");

// Implementation of router.route() method

// index route & create route
router.post("/search", asyncWrap(listingsController.searchAndShowListings));

router.route('/')
.get( asyncWrap(listingsController.showListings))
.post( isLoggedIn, upload.single("listing[img]"), validateListing, listingsController.createListing);
 
 // new route
 router.get("/new", isLoggedIn, listingsController.renderListingform);
 
 // show route
 router.get("/:id", asyncWrap(listingsController.viewListing));
 
 // edit route
 router.get("/:id/edit", isLoggedIn, asyncWrap(listingsController.editListing));
 
 // update route
 router.put("/:id", isLoggedIn, checkOwner, upload.single("listing[img]"), validateListing, asyncWrap(listingsController.updateListing));
 
 // delete route
 router.delete("/:id", isLoggedIn, checkOwner, asyncWrap(listingsController.deleteListing));

 module.exports = router;