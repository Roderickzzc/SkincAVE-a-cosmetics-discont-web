const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    image: String,
    brand: String,
    category: String,
    originPrice: Number,
    ml: Number,
    lowestPrice: Number,
    lowestPerMl: Number,
    description: String
})

module.exports = mongoose.model('Product', productSchema);