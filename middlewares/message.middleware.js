var { create_message_provider, list_message_provider, get_message_provider_schema } = require("../schema/message.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    find_message_provider,
    insert_message_provider_detail,
    sort_insert_message_provider_input_data,
    list_message_provider_controller,
    get_message_provider_controller
} = require("../controller/message.controller");
const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA } = require('../constants/common.constants');

/** Message provider validation */
const message_provider_validation = async (req, res, next) => {
    try {
        const data = await validate(create_message_provider, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Message provider sort input data */
const message_provider_sort_input_data = async (req, res, next) => {
    try {
        const data = await sort_insert_message_provider_input_data(req.body, req[AUTH_DATA]);
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
const message_provider_insert_document = async (req, res, next) => {
    try {
        console.log("got access of insert document");
        let { request_message_provider_data } = req[REQUEST_DATA];

        //Check if already provider is already present there
        await find_message_provider({ username: req.body.username });
        const data = await insert_message_provider_detail(request_message_provider_data);
        const { status, response } = data;
        const { _id, ...rest } = response;

        if (status === SUCCESS) {
            httpResponse(req, res, SUCCESS, { _id });
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

/** List message providers schema validation */
const list_message_provider_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(list_message_provider, req.query);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** List document */
const list_message_provider_middleware = async (req, res, next) => {
    try {
        const { page, page_size, search_text } = req.query;
        const _page = parseInt(page);
        const _page_size = parseInt(page_size);

        let skip = _page_size * (_page - 1);

        const search_query = search_text ? [
            {
                $addFields: {
                    search_name: { $toLower: "$username" }
                }
            },
            {
                $match: {
                    $expr: {
                        $ne: [{ $indexOfCP: ["$search_name", search_text] }, -1]
                    }
                }
            }
        ] : [];
        const data = await list_message_provider_controller([
            ...search_query,
            { $project: { password: 0, search_name: 0 } },
            { $skip: skip },
            { $limit: _page_size }
        ]);
        const { status, response } = data;

        if (status === SUCCESS) {
            httpResponse(req, res, SUCCESS, response);
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

/** Get message provider schema validation */
const get_message_provider_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(get_message_provider_schema, req.params);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Get message provider */
const get_message_provider_middleware = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await get_message_provider_controller({
            _id: id
        });
        const { status, response } = data;

        if (status === SUCCESS) {
            httpResponse(req, res, SUCCESS, response);
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
    message_provider_validation,
    message_provider_sort_input_data,
    message_provider_insert_document,

    list_message_provider_validation_middleware,
    list_message_provider_middleware,

    get_message_provider_validation_middleware,
    get_message_provider_middleware
}