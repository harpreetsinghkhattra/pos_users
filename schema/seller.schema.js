const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");
const { checkMongodbObjectId } = require('.');
var { DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB } = require("../constants/common.constants");

var seller_registeration = Joi.object({
    first_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    last_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    password: Joi.string().custom(customHtmlSanitizeValue).trim().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")).message({ "string.pattern.base": "Invalid password, password must have atleast 8 characters, one uppercase character, one lower case character and one special character.", ...customSanitizeMessage }),
    device_type: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).valid(DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB).required(),
    device_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().allow(null),
    device_signature: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var seller_edit_profile_schema = Joi.object({
    first_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    last_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    mobile_code: Joi.string().min(3).max(3).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    mobile_number: Joi.string().min(10).max(15).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required()
});

module.exports = {
    seller_registeration,
    seller_edit_profile_schema
}