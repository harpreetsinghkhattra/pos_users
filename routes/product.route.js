var express = require('express');
var router = express.Router();
var {
    validate_create_product_category_middleware,
    sort_create_product_category_input_data_middleware,
    insert_product_category_middleware,

    validate_create_product_sub_category_middleware,
    sort_create_product_sub_category_input_data_middleware,
    insert_product_sub_category_middleware,

    validate_create_product_size_middleware,
    sort_create_product_size_input_data_middleware,
    insert_product_size_middleware,

    validate_get_product_category_middleware,
    get_product_category_middleware,

    validate_get_product_sub_category_middleware,
    get_product_sub_category_middleware,

    validate_get_product_size_middleware,
    get_product_size_middleware,

    validate_create_product_form_middleware,
    sort_create_product_form_input_data_middleware,
    create_product_form_middleware,

    validate_create_product_detail_middleware,
    sort_create_product_detail_input_data_middleware,
    create_product_detail_middleware,

    sort_create_product_type_input_data_middleware,
    create_product_type_middleware,
    validate_create_product_type_middleware
} = require("../middlewares/product.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');
var { USER_TYPE_SUPER_ADMIN, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER } = require("../constants/common.constants");

router
    .post("/category",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_create_product_category_middleware,
        sort_create_product_category_input_data_middleware,
        insert_product_category_middleware)
    .get("/category/:category_id",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_get_product_category_middleware,
        get_product_category_middleware);

router
    .post("/sub_category",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_create_product_sub_category_middleware,
        sort_create_product_sub_category_input_data_middleware,
        insert_product_sub_category_middleware)
    .get("/sub_category/:sub_category_id",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_get_product_sub_category_middleware,
        get_product_sub_category_middleware);

router
    .post("/size",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_create_product_size_middleware,
        sort_create_product_size_input_data_middleware,
        insert_product_size_middleware)
    .get("/size/:size_id",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_get_product_size_middleware,
        get_product_size_middleware);

router
    .post("/form",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_create_product_form_middleware,
        sort_create_product_form_input_data_middleware,
        create_product_form_middleware
    )

router
    .post("/create",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER]),
        validate_create_product_detail_middleware,
        sort_create_product_detail_input_data_middleware,
        create_product_detail_middleware
    )

router
    .post("/create/type",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER]),
        validate_create_product_type_middleware,
        sort_create_product_type_input_data_middleware,
        create_product_type_middleware
    )

module.exports = router;
