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
    logout_check_credentials_middleware,

    user_forgot_password_validation_middleware,
    user_sort_forgot_password_input_data_middleware,
    user_forgot_password_middleware,

    user_forgot_password_reset_password_validation_middleware,
    user_sort_forgot_password_reset_password_input_data_middleware,
    user_forgot_password_reset_password_middleware
} = require("../middlewares/user.middleware");
var {
    validate_credentials,
    validate_refresh_token_credentials
} = require("../middlewares/auth.middleware");
const { USER_TYPE_USER, USER_TYPE_CONTENT_WRITER, USER_TYPE_MARKETING, USER_TYPE_SELLER } = require("../constants/common.constants");

router.post("/login",
    login_validation,
    login_sort_input_data,
    login_check_credentials);

router.get("/session_login/:device_signature",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_USER, USER_TYPE_CONTENT_WRITER, USER_TYPE_MARKETING, USER_TYPE_SELLER]),
    session_login_validation_middleware,
    session_login_sort_input_data_middleware,
    session_login_or_refresh_token_check_credentials_middleware);

router.get("/refresh_token/:device_signature",
    (req, res, next) => validate_refresh_token_credentials(req, res, next, [USER_TYPE_USER, USER_TYPE_CONTENT_WRITER, USER_TYPE_MARKETING, USER_TYPE_SELLER]),
    refresh_token_validation_middleware,
    refresh_access_token_sort_input_data_middleware,
    session_login_or_refresh_token_check_credentials_middleware);

router.get("/logout/:uid/:device_signature",
    logout_validation_middleware,
    logout_sort_input_data_middleware,
    logout_check_credentials_middleware);

/** Forgot password */
router.post("/forgot_password",
    user_forgot_password_validation_middleware,
    user_sort_forgot_password_input_data_middleware,
    user_forgot_password_middleware);

/** Reset forgot password */
router.post("/forgot_password/reset_password",
    user_forgot_password_reset_password_validation_middleware,
    user_sort_forgot_password_reset_password_input_data_middleware,
    user_forgot_password_reset_password_middleware);

module.exports = router;
