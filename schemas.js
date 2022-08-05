const Joi = require('joi')


module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        brand: Joi.string().required(),
        category: Joi.string().required(),
        originPrice: Joi.number().required().min(0),
        ml: Joi.number().required().min(0),
        lowestPrice: Joi.number().required().min(0),
        lowestPerMl: Joi.number().required().min(0),
        description: Joi.string().required(),
    }).required()
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})