const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");
const { checkMongodbObjectId } = require('.');
const { INPUT_TYPES, INPUT_TAGS } = require("../constants/common.constants");

var create_product_category_schema = Joi.object({
    name: Joi.string().min(1).max(20).custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).required()
});

var create_product_sub_category_schema = Joi.object({
    category_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid category ID.")).trim().required(),
    name: Joi.string().min(1).max(20).custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).required()
});

var create_product_size_schema = Joi.object({
    category_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid sub category ID.")).trim().required(),
    sub_category_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid sub category ID.")).trim().required(),
    size: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var get_product_category_schema = Joi.object({
    category_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid category ID.")).trim().required()
});

var get_product_sub_category_schema = Joi.object({
    sub_category_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid sub category ID.")).trim().required()
});

var get_product_size_schema = Joi.object({
    size_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid product size ID.")).trim().required()
});

const create_product_form = Joi.object({
    name: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    // form_keys: Joi.array().items(Joi.object({
    //     id: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    //     name: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    //     type: Joi.string().valid(INPUT_TYPES[0], INPUT_TYPES[1]).custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    //     tag: Joi.string().valid(INPUT_TAGS[0], INPUT_TAGS[1], INPUT_TAGS[3]).custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    //     required: Joi.boolean().required()
    // })).required()
})


module.exports = {
    create_product_category_schema,
    create_product_sub_category_schema,
    create_product_size_schema,

    get_product_category_schema,
    get_product_sub_category_schema,
    get_product_size_schema,

    create_product_form
}