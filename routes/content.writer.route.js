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
    content_writer_login_validation_middleware,
    content_writer_login_check_credentials_middleware,

    get_content_writer_user_detail_middleware,

    content_writer_edit_profile_validation_middleware,
    content_writer_edit_profile_sort_input_data_middleware,
    content_writer_edit_profile_insert_document_middleware
} = require('../middlewares/content.writer.middleware');

var {
    content_writer_validate_credentials
} = require('../middlewares/auth.middleware');

/** Login content writer user */
router.post("/login",
    content_writer_login_validation_middleware,
    login_sort_input_data,
    content_writer_login_check_credentials_middleware);

/** Get admin user detail */
router.get("/",
    content_writer_validate_credentials,
    get_content_writer_user_detail_middleware);

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
    content_writer_validate_credentials,
    admin_change_password_validation_middleware,
    admin_sort_change_password_input_data_middleware,
    admin_change_password_middleware);

/** Edit Profile */
router.post("/edit_profile",
    content_writer_validate_credentials,
    content_writer_edit_profile_validation_middleware,
    content_writer_edit_profile_sort_input_data_middleware,
    content_writer_edit_profile_insert_document_middleware);

module.exports = router;
