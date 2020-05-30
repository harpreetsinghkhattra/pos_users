const Joi = require('@hapi/joi');
const { customHtmlSanitizeValue, customSanitizeMessage } = require("./html.sanitize");

var create_message_provider = Joi.object({
    host: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).required(),
    port: Joi.number().required(),
    username: Joi.string().custom(customHtmlSanitizeValue).message({ ...customSanitizeMessage }).trim().required(),
    password: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).required(),
    total_emails: Joi.number().required(),
    account_created_date: Joi.string().isoDate().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).required()
});

var list_message_provider = Joi.object({
    page: Joi.number().min(1).required(),
    page_size: Joi.number().min(1).required(),
    search_text: Joi.string().custom(customHtmlSanitizeValue).trim().message({ ...customSanitizeMessage }).allow(null)
});

var get_message_provider_schema = Joi.object({
    id: Joi.any().required()
});

module.exports = {
    create_message_provider,
    list_message_provider,
    get_message_provider_schema
}