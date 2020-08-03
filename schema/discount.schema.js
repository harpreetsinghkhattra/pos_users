const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");
const { checkMongodbObjectId } = require('.');
const { INPUT_TYPES, INPUT_TAGS, MALE, FEMALE } = require("../constants/common.constants");

var create_product_discount_schema = Joi.object({
    product_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid product ID.")).trim().required(),
    size: Joi
        .array()
        .items(
            {
                discount: Joi.number().min(0).max(100).required(),
                size: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid size ID.")).trim().required()
            }
        )
});

var get_product_discount_schema = Joi.object({
    discount_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid discount ID.")).trim().required()
});

var create_products_discount_schema = Joi.object({
    product_ids: Joi.array().items(
        Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid product ID.")).trim().required()
    ),
    discount: Joi.number().min(0).max(100).required()
});

module.exports = {
    create_product_discount_schema,
    get_product_discount_schema,

    create_products_discount_schema
}