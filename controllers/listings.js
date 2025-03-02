const Listing = require("../models/listing.js")
const { SearchPlace, GeoJSONFormat } = require('../classes/class.js');
const { default: axios } = require("axios");

if( process.env.NODE_ENV != "production" ) {
    require('dotenv').config(); // only used while development stage
}

module.exports.showListings = async (req , res) => {
    // res.locals.originalUrl = req.originalUrl;
    let allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});
    
 };

module.exports.searchAndShowListings = async (req, res) => {   
    // console.log(req.body);
        // res.locals.originalUrl = req.originalUrl;
        if(req.body && !req.body.place){
           let allListings = await Listing.find({});

           return res.render("listings/index.ejs",{allListings});
        }

        if(req.body && typeof req.body.place !== "undefined"){
        // console.log(req.body)
        const place = await new SearchPlace(req.body.place);
        // console.log(place)
        let allListings = await Listing.find(place);
        return res.render("listings/index.ejs",{allListings});
        }

};

 module.exports.renderListingform = (req , res) => {
    //      if(!req.isAuthenticated()){
    //         console.log(req.user); // undefined
    //         req.flash('error', "Logging in is required!");
    //         res.redirect("/login");
    //      } else{
    //          console.log(req.user); // exists
    //          res.render("listings/new.ejs")
    //     }
    
        res.render("listings/new.ejs")
};

module.exports.viewListing = async (req , res) => {
      res.locals.token = process.env.MAP_API_KEY;
      let {id} = req.params;
  
      const listing = await Listing.findById(id)
      .populate({path: "reviews",  // nested population
         populate: {
             path: "author"
         }
      })
      .populate("owner");
     //  console.log(listing);
      res.render("listings/show.ejs",{listing});
  };

module.exports.createListing = async (req , res, next) => {

    const address = req.body.listing.location+","+req.body.listing.country;
    // console.log(address);
    let mapUrl = `https://maps.gomaps.pro/maps/api/geocode/json?address=Address&key=${process.env.MAP_API_KEY}`;
    mapUrl = mapUrl.replace("Address",address).replace(" ","+");
    // console.log(url);
    const response = await axios.get(mapUrl);
    const coordinates = await response.data.results[0].geometry.location;
    
    const geoJSON = await new GeoJSONFormat(coordinates);
    console.log(geoJSON);
    
    // let {title , description , img , price , location , country} = req.body;
    // console.log(req.body.listing);
    // if(!req.body.listing){
    //     next(new customErrorClass(400 , "all input field's data is empty"));
    // }
    // const result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     next(new CustomErrorClass(400, result.error));
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"  ",filename);
    let newListing = await new Listing(req.body.listing);
    newListing.img = {
        url: url,
        filename: filename
    }
    newListing.owner = req.user._id;
    newListing.geometry = geoJSON;
    console.log(newListing);
    // if(!newListing.title){
    //     next(new CustomErrorClass(400 , "title Required"));
    // }
    newListing.save();
    req.flash("nlsuccess", "New Listing Added!");
    res.redirect("/listings");
};


 module.exports.editListing = async (req , res) => {
      let {id} = req.params;
      let listing = await Listing.findById(id);
      let originalImageUrl = listing.img.url;
      let manipulatedImg = originalImageUrl.replace("/upload", "/upload/w_300,h_250/e_blur:100");

      res.render("listings/edit.ejs",{ listing , manipulatedImg});
  };


 module.exports.updateListing = async (req , res) => {
    let {id} = req.params;
   //  console.log(listing);
   //  console.log(listing.owner);
   //  console.log(res.locals.currentUser._id);
   //  if(!listing.owner.equals(res.locals.currentUser._id)) {
   //     req.flash('wrongOwner', "You are not the owner of this Listing!");
   //     return res.redirect(`/listings/${id}/edit`);
    //  }
    listing = await Listing.findByIdAndUpdate(id,req.body.listing,{new:true, runValidators:true});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.img = {
            url: url,
            filename: filename
        }
        await listing.save();
    }
        let updatedListing = await Listing.findById(id);
   //  console.log(updatedListing);
    res.redirect(`/listings/${id}`);   
}; 


 module.exports.deleteListing = async (req , res) => {
    let {id} = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    req.flash("nldelete", "Listing deleted");
    console.log(deleted);
    res.redirect("/listings");
};