var express = require('express');
var router = express.Router();

var {
    login_sort_input_data
} = require("../middlewares/user.middleware");

var {
    admin_signup_validation_middleware,
    admin_signup_insert_document_middleware,
    admin_signup_sort_input_data_middleware,

    admin_login_validation_middleware,
    admin_login_check_credentials_middleware,

    get_admin_user_detail_middleware,

    admin_forgot_password_validation_middleware,
    admin_sort_forogt_password_input_data_middleware,
    admin_forgot_password_middleware,

    admin_forgot_password_reset_password_validation_middleware,
    admin_sort_forgot_password_reset_password_input_data_middleware,
    admin_forgot_password_reset_password_middleware,

    admin_change_password_validation_middleware,
    admin_sort_change_password_input_data_middleware,
    admin_change_password_middleware,

    update_admin_detail_validation_middleware,
    update_admin_detail_input_data_middleware,
    update_admin_detail_middleware
} = require("../middlewares/admin.middleware");

var {
    content_writer_signup_validation_middleware,
    content_writer_signup_insert_document_middleware,
    content_writer_signup_sort_input_data_middleware
} = require('../middlewares/content.writer.middleware');

var {
    sails_user_signup_validation_middleware,
    sails_user_signup_insert_document_middleware,
    sails_user_signup_sort_input_data_middleware
} = require('../middlewares/sails.middleware');

var {
    validate_credentials
} = require('../middlewares/auth.middleware');

var { USER_TYPE_USER, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER, USER_TYPE_SUPER_ADMIN, USER_TYPE_MARKETING } = require('../constants/common.constants');

/** Create admin user */
router.post("/signup",
    admin_signup_validation_middleware,
    admin_signup_sort_input_data_middleware,
    admin_signup_insert_document_middleware);

/** Get admin user detail */
router.get("/",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    get_admin_user_detail_middleware);

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
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    admin_change_password_validation_middleware,
    admin_sort_change_password_input_data_middleware,
    admin_change_password_middleware);

/** Content Writer user registeration */
router.post("/register/content_writer",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    content_writer_signup_validation_middleware,
    content_writer_signup_sort_input_data_middleware,
    content_writer_signup_insert_document_middleware
);

/** Sails user registeration */
router.post("/register/sails",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    sails_user_signup_validation_middleware,
    sails_user_signup_sort_input_data_middleware,
    sails_user_signup_insert_document_middleware
);

/** Edit admin */
router.post("/edit",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    update_admin_detail_validation_middleware,
    update_admin_detail_input_data_middleware,
    update_admin_detail_middleware
);

module.exports = router;
