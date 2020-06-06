const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");
const { checkMongodbObjectId } = require('.');
var { DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB } = require("../constants/common.constants");

var registeration = Joi.object({
    first_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    last_name: Joi.string().min(3).max(20).custom(customHtmlSanitizeValue).trim().allow(null).message({ ...customSanitizeMessage }).required(),
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    password: Joi.string().custom(customHtmlSanitizeValue).trim().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")).message({ "string.pattern.base": "Invalid password, password must have atleast 8 characters, one uppercase character, one lower case character and one special character.", ...customSanitizeMessage }),
    device_type: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).valid(DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB).required(),
    device_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().allow(null),
    device_signature: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var login = Joi.object({
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    password: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    device_type: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).valid(DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB).required(),
    device_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().allow(null),
    device_signature: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var session_login = Joi.object({
    device_signature: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var refresh_token = Joi.object({
    device_signature: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var logout = Joi.object({
    uid: Joi.string().custom((value, helper) => checkMongodbObjectId(value, helper, "Invalid user ID.")).trim().required(),
    device_signature: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var user_forgot_password_schema = Joi.object({
    email: Joi.string().email().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required()
});

var user_forgot_password_reset_password_schema = Joi.object({
    forgot_password_access_token: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    new_password: Joi.string().custom(customHtmlSanitizeValue).trim().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")).message({ "string.pattern.base": "Invalid password, password must have atleast 8 characters, one uppercase character, one lower case character and one special character.", ...customSanitizeMessage }).required()
});

module.exports = {
    registeration,
    login,
    session_login,
    refresh_token,
    logout,

    user_forgot_password_schema,
    user_forgot_password_reset_password_schema
}