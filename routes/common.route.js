var express = require('express');
var router = express.Router();
var {
    login_validation,
    login_sort_input_data,
    login_check_credentials,

    session_login_validation_middleware,
    session_login_sort_input_data_middleware,

    session_login_validation_middleware,
    session_login_sort_input_data_middleware,
    session_login_or_refresh_token_check_credentials_middleware,

    refresh_access_token_sort_input_data_middleware,
    refresh_token_validation_middleware,

    logout_validation_middleware,
    logout_sort_input_data_middleware,
    logout_check_credentials_middleware
} = require("../middlewares/user.middleware");
var {
    validate_credentials,
    validate_refresh_token_credentials
} = require("../middlewares/auth.middleware");

router.post("/login",
    login_validation,
    login_sort_input_data,
    login_check_credentials);

router.get("/session_login/:device_signature",
    validate_credentials,
    session_login_validation_middleware,
    session_login_sort_input_data_middleware,
    session_login_or_refresh_token_check_credentials_middleware);

router.get("/refresh_token/:device_signature",
    validate_refresh_token_credentials,
    refresh_token_validation_middleware,
    refresh_access_token_sort_input_data_middleware,
    session_login_or_refresh_token_check_credentials_middleware);

router.get("/logout/:uid/:device_signature",
    logout_validation_middleware,
    logout_sort_input_data_middleware,
    logout_check_credentials_middleware);

module.exports = router;
