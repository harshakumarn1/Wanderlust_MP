const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const { listingSchema } = require('./listingSchema.js');
const CustomErrorClass = require('./utils/customErrorClass.js');


module.exports.checkOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('wrongOwner', "You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(review)
    if(!review.author.equals(res.locals.currentUser._id)) {
        req.flash('reviewDelete', "You can't delete someone's Review!");
        return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.validateListing = async (req, res, next) => {
    console.log(req.body);
    const result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        next(new CustomErrorClass(400, result.error));
    } else {
        next();
    }
}