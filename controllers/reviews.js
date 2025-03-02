const Review = require('../models/reviews.js');
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    // console.log(req.body.review);
    const newReview = await new Review(req.body.review);
    newReview.author = req.user;
    console.log(newReview);
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("reviewsuccess", "a Review Added");
    // console.log(listing);
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    
    let { id , reviewId } = req.params;
    console.log(id , reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}},{new: true}).then(
        (res) => {
            console.log(res);
        }
    )
    await Review.findByIdAndDelete(reviewId).then(
        (res) => {
            console.log(res);
        }
    );
    req.flash("reviewdelete", "Review deleted");
    res.redirect(`/listings/${id}`);
};
