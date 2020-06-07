var {
    create_product_category_schema,
    create_product_sub_category_schema,
    create_product_size_schema,

    get_product_category_schema,
    get_product_sub_category_schema,
    get_product_size_schema,

    create_product_form
} = require("../schema/product.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    sort_product_category_input_data_controller,
    insert_or_update_product_category_detail_controller,

    sort_product_sub_category_input_data_controller,
    insert_or_update_product_sub_category_detail_controller,

    sort_product_size_insert_input_data_controller,
    insert_or_update_product_size_detail_controller,

    get_product_category_controller,
    get_product_sub_category_controller,
    get_product_size_controller,

    sort_product_form_insert_input_data_controller,
    insert_product_form_detail_controller
} = require("../controller/product.controller");

const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS } = require('../constants/common.constants');

/** Create product category validate schema */
const validate_create_product_category_middleware = async (req, res, next) => {
    try {
        const data = await validate(create_product_category_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sort product category input data */
const sort_create_product_category_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_product_category_input_data_controller(req.body);
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

/** Insert document */
const insert_product_category_middleware = async (req, res, next) => {
    try {
        let { query, insert } = req[REQUEST_DATA];

        const data = await insert_or_update_product_category_detail_controller(query, insert);
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

/** Create product sub category validate schema */
const validate_create_product_sub_category_middleware = async (req, res, next) => {
    try {
        const data = await validate(create_product_sub_category_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sort product sub category input data */
const sort_create_product_sub_category_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_product_sub_category_input_data_controller(req.body);
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

/** Insert document */
const insert_product_sub_category_middleware = async (req, res, next) => {
    try {
        let { query, insert } = req[REQUEST_DATA];

        const data = await insert_or_update_product_sub_category_detail_controller(query, insert);
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

/** Create product size validate schema */
const validate_create_product_size_middleware = async (req, res, next) => {
    try {
        const data = await validate(create_product_size_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sort product size input data */
const sort_create_product_size_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_product_size_insert_input_data_controller(req.body);
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

/** Insert document */
const insert_product_size_middleware = async (req, res, next) => {
    try {
        let { query, insert } = req[REQUEST_DATA];

        console.log(query)
        const data = await insert_or_update_product_size_detail_controller(query, insert);
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

/** Get product category validate schema */
const validate_get_product_category_middleware = async (req, res, next) => {
    try {
        const data = await validate(get_product_category_schema, req.params);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Get document */
const get_product_category_middleware = async (req, res, next) => {
    try {
        const { category_id } = req.params;

        const { status, response } = await get_product_category_controller({
            _id: category_id
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

/** Get product sub category validate schema */
const validate_get_product_sub_category_middleware = async (req, res, next) => {
    try {
        const data = await validate(get_product_sub_category_schema, req.params);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Get document */
const get_product_sub_category_middleware = async (req, res, next) => {
    try {
        const { sub_category_id } = req.params;

        const { status, response } = await get_product_sub_category_controller({
            _id: sub_category_id
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

/** Get product size validate schema */
const validate_get_product_size_middleware = async (req, res, next) => {
    try {
        const data = await validate(get_product_size_schema, req.params);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Get document */
const get_product_size_middleware = async (req, res, next) => {
    try {
        const { size_id } = req.params;

        const { status, response } = await get_product_size_controller({
            _id: size_id
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

/** create product form validate schema */
const validate_create_product_form_middleware = async (req, res, next) => {
    try {
        const data = await validate(create_product_form, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sort product form input data */
const sort_create_product_form_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_product_form_insert_input_data_controller(req.body);
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

/** Create document */
const create_product_form_middleware = async (req, res, next) => {
    try {
        const { query, insert } = req[REQUEST_DATA];

        const { status, response } = await insert_product_form_detail_controller(query, insert);

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
    create_product_form_middleware
}