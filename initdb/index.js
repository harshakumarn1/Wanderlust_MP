const mongoose = require('mongoose');
const Listing = require('../models/listing.js');

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlast");
};
main().then(() => {
    console.log("node.js connected with wanderlast database of MongoDB");
}).catch((err) => {
    console.log(err);
});

let initData = require('./data.js');


const initdb = async () => {
    // console.log(initData.data);
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '67b4743a265194cb8e25016b'}));
    const geometry = { type: 'point', coordinates: [ 77.5945627, 12.9715987 ] };
    initData.data = initData.data.map((obj) => ({...obj, geometry: geometry}));
    console.log(initData.data)
    await Listing.insertMany(initData.data);
    // let listings = await Listing.find({});
    // console.log(listings);
};

initdb();