var express = require('express');
var router = express.Router();

var { signup_validation, signup_insert_document, signup_sort_input_data, login_validation, login_sort_input_data, login_check_credentials, get_user_detail_middleware } = require("../middlewares/user.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');

router.post("/signup", signup_validation, signup_sort_input_data, signup_insert_document);
router.post("/login", login_validation, login_sort_input_data, login_check_credentials);
router.get("/", validate_credentials, get_user_detail_middleware);

module.exports = router;
