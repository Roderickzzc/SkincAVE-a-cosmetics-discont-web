const Product = require('../models/product');
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const products = await Product.find({});
    res.render('productView/index', { products })
    console.log(products.image)
}

module.exports.renderNewForm = (req, res) => {
    res.render('productView/new')
}

module.exports.createProduct = async (req, res, next) => {
    //if (!req.body.product) throw new ExpressError('Invalid product data', 400)
    const newProduct = new Product(req.body.product)
    newProduct.image = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    newProduct.author = req.user._id;
    await newProduct.save()
    req.flash('success', 'Successfully made a new product!')
    res.redirect(`/products/${newProduct._id}`)

}

module.exports.showProduct = async (req, res) => {
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
    //console.log(product)
    res.render('productView/show', { product })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
        req.flash('error', 'Cannot find that product!')
        return res.redirect('/products')
    }
    res.render('productView/edit', { product })
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product })
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    product.image.push(...imgs)
    await product.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await product.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
        console.log(product)
    }

    req.flash('success', 'Successfully updated product!')
    res.redirect(`/products/${product._id}`)
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a product!')
    res.redirect('/products')
}