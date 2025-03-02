const express = require('express');
const router = express.Router({mergeParams: true});

const asyncWrap = require('../utils/asyncWrap.js')
const CustomErrorClass = require('../utils/customErrorClass.js');
const { reviewSchema } = require('../listingSchema.js');
const { isLoggedIn } = require('../loggedin.js');
const { isReviewOwner } = require('../routeMiddleware.js');

const reviewController = require('../controllers/reviews.js');

const validateReview = async (req, res, next) => {
    const result = await reviewSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        console.log(result);
        next(new CustomErrorClass(400, "review validation failed"));
    } else {
        next();
    }
}

// Reviews
// post route
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewController.createReview));

// delete route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, asyncWrap(reviewController.deleteReview));

module.exports = router;