const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");
const { checkMongodbObjectId } = require('.');

var create_selected_shop_schema = Joi.object({
    name: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().min(1).max(50).required(),
    coordinates: Joi.object({
        lng: Joi.number().min(-180).max(180).required(),
        lat: Joi.number().min(-90).max(90).required()
    })
});

var get_selected_shop_schema = Joi.object({
    shop_id: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid discount ID.")).trim().required()
});

module.exports = {
    create_selected_shop_schema,
    get_selected_shop_schema
}