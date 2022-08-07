const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Product = require('../models/product');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware')


router.get('/', catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.render('productView/index', { products })
}))

router.get('/new', isLoggedIn, (req, res) => {

    res.render('productView/new')
})



router.post('/', isLoggedIn, validateProduct, catchAsync(async (req, res, next) => {
    //if (!req.body.product) throw new ExpressError('Invalid product data', 400)
    const newProduct = new Product(req.body.product)
    newProduct.author = req.user._id;
    await newProduct.save()
    req.flash('success', 'Successfully made a new product!')
    res.redirect(`/products/${newProduct._id}`)

}))

router.get('/:id', catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!product) {
        req.flash('error', 'Cannot find that product!')
        return res.redirect('/products')
    }
    res.render('productView/show', { product })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
        req.flash('error', 'Cannot find that product!')
        return res.redirect('/products')
    }
    res.render('productView/edit', { product })
}))

router.put('/:id', isLoggedIn, isAuthor, validateProduct, catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product })
    req.flash('success', 'Successfully updated product!')
    res.redirect(`/products/${product._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a product!')
    res.redirect('/products')
}))

module.exports = router;