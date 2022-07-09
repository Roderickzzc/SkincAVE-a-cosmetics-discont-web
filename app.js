const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const Product = require('./models/product');
const axios = require('axios')
//const Joi = require('joi')
const { productSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')



mongoose.connect('mongodb://localhost:27017/skin-cave')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateProduct = (req, res, next) => {

    const { error } = productSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/products', catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.render('productView/index', { products })
}))

app.get('/products/new', (req, res) => {
    res.render('productView/new')
})



app.post('/products', validateProduct, catchAsync(async (req, res, next) => {
    //if (!req.body.product) throw new ExpressError('Invalid product data', 400)

    const newProduct = new Product(req.body.product)
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`)

}))

app.get('/products/:id', catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('productView/show', { product })
}))

app.get('/products/:id/edit', catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('productView/edit', { product })
}))

app.put('/products/:id', validateProduct, catchAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product })
    res.redirect(`/products/${product._id}`)
}))

app.delete('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})