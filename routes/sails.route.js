var express = require('express');
var router = express.Router();

var {
    login_sort_input_data
} = require("../middlewares/user.middleware");

var {
    admin_forgot_password_validation_middleware,
    admin_sort_forogt_password_input_data_middleware,
    admin_forgot_password_middleware,

    admin_forgot_password_reset_password_validation_middleware,
    admin_sort_forgot_password_reset_password_input_data_middleware,
    admin_forgot_password_reset_password_middleware,

    admin_change_password_validation_middleware,
    admin_sort_change_password_input_data_middleware,
    admin_change_password_middleware
} = require("../middlewares/admin.middleware");

var {
    sails_user_login_validation_middleware,
    sails_user_login_check_credentials_middleware,

    get_sails_user_detail_middleware,

    update_sails_detail_validation_middleware,
    update_sails_detail_input_data_middleware,
    update_sails_detail_middleware
} = require('../middlewares/sails.middleware');

var {
    sails_validate_credentials, validate_credentials
} = require('../middlewares/auth.middleware');
const { USER_TYPE_MARKETING } = require('../constants/common.constants');

/** Login content writer user */
router.post("/login",
    sails_user_login_validation_middleware,
    login_sort_input_data,
    sails_user_login_check_credentials_middleware);

/** Get admin user detail */
router.get("/",
    sails_validate_credentials,
    get_sails_user_detail_middleware);

/** Forgot password */
router.post("/forgot_password",
    admin_forgot_password_validation_middleware,
    admin_sort_forogt_password_input_data_middleware,
    admin_forgot_password_middleware);

/** Reset forgot password */
router.post("/forgot_password/reset_password",
    admin_forgot_password_reset_password_validation_middleware,
    admin_sort_forgot_password_reset_password_input_data_middleware,
    admin_forgot_password_reset_password_middleware);

/** Change password */
router.post("/change_password",
    sails_validate_credentials,
    admin_change_password_validation_middleware,
    admin_sort_change_password_input_data_middleware,
    admin_change_password_middleware);

/** Edit sails user detail */
router.post("/edit",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_MARKETING]),
    update_sails_detail_validation_middleware,
    update_sails_detail_input_data_middleware,
    update_sails_detail_middleware);

module.exports = router;
