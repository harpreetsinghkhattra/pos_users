var {
    create_selected_shop_schema,
    get_selected_shop_schema
} = require("../schema/selected_shops.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    sort_selected_shop_input_data_controller,
    insert_or_update_selected_shops_detail_controller,

    get_selected_shop_controller
} = require("../controller/selected_shops.controller");

const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS } = require('../constants/common.constants');

/** Create Or Update selected shop validate schema */
const validate_create_or_update_selected_shop_middleware = async (req, res, next) => {
    try {
        const data = await validate(create_selected_shop_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sort selected shop input data */
const sort_create_or_update_selected_shop_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_selected_shop_input_data_controller(req.body);
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
const insert_or_update_selected_shop_middleware = async (req, res, next) => {
    try {
        let { query, insert } = req[REQUEST_DATA];

        const data = await insert_or_update_selected_shops_detail_controller(query, insert);
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

/** Get selected shop validate schema */
const validate_get_selected_shop_middleware = async (req, res, next) => {
    try {
        const data = await validate(get_selected_shop_schema, req.params);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Get document */
const get_selected_shop_middleware = async (req, res, next) => {
    try {
        const { shop_id } = req.params;

        const { status, response } = await get_selected_shop_controller({
            _id: shop_id
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
    validate_create_or_update_selected_shop_middleware,
    sort_create_or_update_selected_shop_input_data_middleware,
    insert_or_update_selected_shop_middleware,

    validate_get_selected_shop_middleware,
    get_selected_shop_middleware
}