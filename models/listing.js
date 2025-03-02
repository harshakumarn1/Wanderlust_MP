const mongoose = require('mongoose');
const Review = require("./reviews.js");
const { required } = require('joi');

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    img:{
        url: {
            type:String
        },
        filename: {
            type:String,
        }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type:String,
            enum: ['point'],
            required: true
        },
        coordinates: {
            type: Array,
            required: true
        }
    }
});

// post middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    await Review.deleteMany({_id: {$in: listing.reviews }});
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;