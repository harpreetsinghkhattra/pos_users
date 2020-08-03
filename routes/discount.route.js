var express = require('express');
var router = express.Router();
var {
    validate_create_or_update_product_discount_middleware,
    sort_create_or_update_product_discount_input_data_middleware,
    insert_or_update_product_discount_middleware,

    validate_get_product_discount_middleware,
    get_product_discount_middleware
} = require("../middlewares/discount.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');
var { USER_TYPE_SUPER_ADMIN, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER } = require("../constants/common.constants");

router
    .post("/",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_create_or_update_product_discount_middleware,
        sort_create_or_update_product_discount_input_data_middleware,
        insert_or_update_product_discount_middleware)
    .get("/:discount_id",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_get_product_discount_middleware,
        get_product_discount_middleware);

module.exports = router;
