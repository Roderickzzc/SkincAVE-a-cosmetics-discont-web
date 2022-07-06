const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const Product = require('./models/product');
const axios = require('axios')
const methodOverride = require('method-override')


mongoose.connect('mongodb://localhost:27017/skin-cave')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('productView/index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('productView/new')
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body.product)
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('productView/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('productView/edit', { product })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product })
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})