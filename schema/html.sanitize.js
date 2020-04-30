const sanitize_html = require('sanitize-html');

const customHtmlSanitizeValue = (value, params) => {
    const sanitizedHtml = sanitize_html(value, {
        allowedTags: [],
        allowedAttributes: {},
    });

    if (!sanitizedHtml) return params.error("string.sanitize_html");

    return sanitizedHtml;
}

const customSanitizeMessage = { "string.sanitize_html": "Invalid value, make sure input doesn't contain any html tag." };

module.exports = {
    customHtmlSanitizeValue,
    customSanitizeMessage
}