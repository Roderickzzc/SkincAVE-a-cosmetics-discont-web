const { productSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Product = require('./models/product')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    //console.log("req.user", req.user)
    if (!req.isAuthenticated()) {
        // store the url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateProduct = (req, res, next) => {

    const { error } = productSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/products/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/products/${id}`)
    }
    next();
}