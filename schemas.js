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
        description: Joi.number().required(),
    }).required()
})
