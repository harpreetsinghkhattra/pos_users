var express = require('express');
var router = express.Router();

var { message_provider_validation, message_provider_sort_input_data, message_provider_insert_document, list_message_provider_middleware, list_message_provider_validation_middleware, get_message_provider_validation_middleware, get_message_provider_middleware } = require("../middlewares/message.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');

router.post("/provider", validate_credentials, message_provider_validation, message_provider_sort_input_data, message_provider_insert_document );
router.get("/provider", validate_credentials, list_message_provider_validation_middleware, list_message_provider_middleware );
router.get("/provider/:id", validate_credentials, get_message_provider_validation_middleware, get_message_provider_middleware );

module.exports = router;
