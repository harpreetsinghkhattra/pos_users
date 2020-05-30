const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");

var { DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB } = require("../constants/common.constants");

var admin_registeration_schema = Joi.object({
    first_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    last_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    password: Joi.string().custom(customHtmlSanitizeValue).trim().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")).message({ "string.pattern.base": "Invalid password, password must have atleast 8 characters, one uppercase character, one lower case character and one special character.", ...customSanitizeMessage }).required(),
    device_type: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).valid(DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB).required(),
    device_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().allow(null)
});

var admin_login_schema = Joi.object({
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    password: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    device_type: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).valid(DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB).required(),
    device_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().allow(null)
});

var admin_forgot_password_schema = Joi.object({
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var admin_forgot_password_reset_password_schema = Joi.object({
    forgot_password_access_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    new_password: Joi.string().custom(customHtmlSanitizeValue).trim().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")).message({ "string.pattern.base": "Invalid password, password must have atleast 8 characters, one uppercase character, one lower case character and one special character.", ...customSanitizeMessage }).required()
});

var admin_change_password_schema = Joi.object({
    new_password: Joi.string().custom(customHtmlSanitizeValue).trim().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")).message({ "string.pattern.base": "Invalid password, password must have atleast 8 characters, one uppercase character, one lower case character and one special character.", ...customSanitizeMessage }).required()
});

module.exports = {
    admin_registeration_schema,
    admin_login_schema,
    admin_forgot_password_schema,
    admin_forgot_password_reset_password_schema,
    admin_change_password_schema
}