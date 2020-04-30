var Joi = require("@hapi/joi");

var { USER_TYPE_ADMIN, USER_TYPE_COOK, USER_TYPE_GUEST, LOGIN_TYPE_CUSTOM_USER, LOGIN_TYPE_FACEBOOK, LOGIN_TYPE_GOOGLE, DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB, ACTIVE, DEACTIVE } = require("../constants/common.constants");

var user_detail = Joi.object({
    uid: Joi.any().required(),
    first_name: Joi.string().min(3).max(20).allow(null),
    last_name: Joi.string().min(3).max(20).allow(null),
    email: Joi.string().email().required(),
    mobile_number: Joi.number().allow(null),
    mobile_code: Joi.number().allow(null),
    created_at: Joi.date().iso().required(),
    updated_at: Joi.date().iso().required()
});

var user_information = Joi.object({
    user_type: Joi.string().valid(USER_TYPE_ADMIN, USER_TYPE_COOK, USER_TYPE_GUEST).required(),
    login_type: Joi.string().valid(LOGIN_TYPE_CUSTOM_USER, LOGIN_TYPE_FACEBOOK, LOGIN_TYPE_GOOGLE).required(),
    password: Joi.string(),
    salt: Joi.string().uuid().required(),
    email: Joi.string().allow(null),
    provider_user_id: Joi.string().allow(null),
    status: Joi.string().valid(ACTIVE, DEACTIVE).required(),
    delete_status: Joi.string().valid(ACTIVE, DEACTIVE).required(),
    created_at: Joi.date().iso().required(),
    updated_at: Joi.date().iso().required()
});

var device_tokens = Joi.object({
    token: Joi.string().allow(null),
    uid: Joi.any().required(),
    device_type: Joi.string().valid(DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB).required(),
    status: Joi.string().valid(ACTIVE, DEACTIVE).required(),
    created_at: Joi.date().iso().required(),
    updated_at: Joi.date().iso().required()
});

var sso_tokens = Joi.object({
    access_token: Joi.string().required(),
    refresh_token: Joi.string().required(),
    expires_in: Joi.number().required(),
    device_signature: Joi.string().allow(null),
    uid: Joi.any().required(),
    status: Joi.string().valid(ACTIVE, DEACTIVE).required(),
    created_at: Joi.date().iso().required(),
    updated_at: Joi.date().iso().required()
});

module.exports = {
    user_detail,
    device_tokens,
    sso_tokens,
    user_information
}