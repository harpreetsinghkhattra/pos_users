var {
    create_product_discount_schema,
    get_product_discount_schema,

    create_products_discount_schema
} = require("../schema/discount.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    sort_single_product_discount_input_data_controller,
    insert_or_update_single_product_discount_detail_controller,

    get_product_discount_controller
} = require("../controller/discount.controller");

const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS } = require('../constants/common.constants');

/** Create Or Update product discount validate schema */
const validate_create_or_update_product_discount_middleware = async (req, res, next) => {
    try {
        const data = await validate(create_product_discount_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sort product discount input data */
const sort_create_or_update_product_discount_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_product_discount_input_data_controller(req.body);
        req[REQUEST_DATA] = data;
        next();
    } catch (error) {
        let status = error && error.status && typeof error.status === "string" ? error.status : null;

        if (status) {
            let response = error.response;
            next(httpResponse(req, res, status, response));
            return;
        }

        next(error);
    }
}

/** Insert or Update document */
const insert_or_update_product_discount_middleware = async (req, res, next) => {
    try {
        let { query, insert } = req[REQUEST_DATA];

        const data = await insert_or_update_single_product_discount_detail_controller(query, insert);
        const { status, response = {} } = data;

        if (status === SUCCESS) {
            const { created_at, updated_at, ...rest } = response;
            httpResponse(req, res, SUCCESS, {
                ...rest
            });
        } else next(httpResponse(req, res, status, response));
    } catch (error) {
        console.log("error ===> ", error);
        let status = error && error.status && typeof error.status === "string" ? error.status : null;

        if (status) {
            let response = error.response;
            next(httpResponse(req, res, status, response));
            return;
        }

        next(error);
    }
}

/** Get product discount validate schema */
const validate_get_product_discount_middleware = async (req, res, next) => {
    try {
        const data = await validate(get_product_discount_schema, req.params);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Get document */
const get_product_discount_middleware = async (req, res, next) => {
    try {
        const { discount_id } = req.params;

        const { status, response } = await get_product_discount_controller({
            _id: discount_id
        });

        if (status === SUCCESS) {
            httpResponse(req, res, SUCCESS, {
                ...response
            });
        } else next(httpResponse(req, res, status, response));
    } catch (error) {
        console.log("error ===> ", error);
        let status = error && error.status && typeof error.status === "string" ? error.status : null;

        if (status) {
            let response = error.response;
            next(httpResponse(req, res, status, response));
            return;
        }

        next(error);
    }
}

module.exports = {
    validate_create_or_update_product_discount_middleware,
    sort_create_or_update_product_discount_input_data_middleware,
    insert_or_update_product_discount_middleware,

    validate_get_product_discount_middleware,
    get_product_discount_middleware
}