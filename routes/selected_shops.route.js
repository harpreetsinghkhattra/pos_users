var express = require('express');
var router = express.Router();
var {
    validate_create_or_update_selected_shop_middleware,
    sort_create_or_update_selected_shop_input_data_middleware,
    insert_or_update_selected_shop_middleware,

    validate_get_selected_shop_middleware,
    get_selected_shop_middleware
} = require("../middlewares/selected_shops.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');
var { USER_TYPE_SUPER_ADMIN, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER } = require("../constants/common.constants");

router
    .post("/",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_create_or_update_selected_shop_middleware,
        sort_create_or_update_selected_shop_input_data_middleware,
        insert_or_update_selected_shop_middleware)
    .get("/:shop_id",
        (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
        validate_get_selected_shop_middleware,
        get_selected_shop_middleware);

module.exports = router;
