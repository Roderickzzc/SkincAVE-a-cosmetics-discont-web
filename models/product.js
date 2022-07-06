const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    brand: String,
    category: String,
    originPrice: String,
    ml: String,
    lowestPrice: String,
    lowestPerMl: String
})

module.exports = mongoose.model('Product', productSchema);