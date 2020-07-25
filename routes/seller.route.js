var express = require('express');
var router = express.Router();
var {
    seller_signup_validation,
    seller_signup_sort_input_data,
    seller_signup_insert_document,

    get_seller_detail_middleware,

    update_seller_detail_validation_middleware,
    update_seller_detail_input_data_middleware,
    update_seller_detail_middleware
} = require("../middlewares/seller.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');
var { USER_TYPE_SELLER } = require("../constants/common.constants");

router.post("/signup",
    seller_signup_validation,
    seller_signup_sort_input_data,
    seller_signup_insert_document);
router.get("/",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SELLER]),
    get_seller_detail_middleware);
router.post("/edit",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SELLER]),
    update_seller_detail_validation_middleware,
    update_seller_detail_input_data_middleware,
    update_seller_detail_middleware)

module.exports = router;
