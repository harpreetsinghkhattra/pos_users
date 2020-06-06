var express = require('express');
var router = express.Router();
var {
    signup_validation,
    signup_insert_document,
    signup_sort_input_data,
    login_validation,
    login_sort_input_data,
    login_check_credentials,
    get_user_detail_middleware
} = require("../middlewares/user.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');
var { USER_TYPE_USER } = require("../constants/common.constants");

router.post("/signup",
    signup_validation,
    signup_sort_input_data,
    signup_insert_document);
router.get("/",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_USER]),
    get_user_detail_middleware);

module.exports = router;
