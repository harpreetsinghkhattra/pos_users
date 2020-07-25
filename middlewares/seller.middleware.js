var {
    seller_registeration,
    seller_edit_profile
} = require("../schema/seller.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    insert_user_information,
    insert_sso_token,
    insert_device_token,
    find_user,

    sort_login_user_input_data: login_sort_input_data_controller,
    get_user_detail,
    get_sso_user_token
} = require("../controller/user.controller");
const {
    sort_insert_seller_input_data,
    insert_seller_detail,
    get_seller_detail,

    validate_edit_seller_model,
    sort_edit_seller_input_data,
    edit_seller_detail
} = require("../controller/seller.controller");

const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA, USER_TYPE_SUPER_ADMIN, USER_TYPE_MARKETING, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER, USER_TYPE_USER, USER_DATA } = require('../constants/common.constants');
var { ObjectId } = require('mongodb');

/** Seller signup validation */
const seller_signup_validation = async (req, res, next) => {
    try {
        const data = await validate(seller_registeration, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Seller signup sort input data */
const seller_signup_sort_input_data = async (req, res, next) => {
    try {
        const data = await sort_insert_seller_input_data(req.body);
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
const seller_signup_insert_document = async (req, res, next) => {
    try {
        console.log("Signup insert document");
        let { request_data_user_detail, request_data_user_infromation, request_data_device_token, request_data_sso_token } = req[REQUEST_DATA];

        await find_user({ email: req.body.email });
        const data = await insert_user_information(request_data_user_infromation);
        const { status, response } = data;

        if (status === SUCCESS) {
            //Update uid in request data to validate them
            request_data_user_detail.uid = response._id;
            request_data_device_token.uid = response._id;
            request_data_sso_token.uid = response._id;
            const query = {
                uid: response._id,
                device_signature: request_data_sso_token.device_signature
            }

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                insert_seller_detail(request_data_user_detail),
                insert_sso_token(query, request_data_sso_token),
                insert_device_token(query, request_data_device_token)
            ]);

            const [user_detail_response, data_sso_token_response] = save_user_detail_response;

            const { created_at, updated_at, ...rest_user_detail_response } = user_detail_response.response;
            const { device_signature, created_at: token_created_at, updated_at: token_updated_at, ...rest_data_sso_token_response } = data_sso_token_response.response;

            httpResponse(req, res, SUCCESS, {
                user_detail: { ...rest_user_detail_response },
                token: { ...rest_data_sso_token_response }
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

/** Get seller detail */
const get_seller_detail_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];

        //Save user detail response
        const save_user_detail_response = await Promise.all([
            get_seller_detail({ uid: ObjectId(uid) }),
            get_sso_user_token({ uid: ObjectId(uid) })
        ]);

        const [user_detail_response, data_sso_token_response] = save_user_detail_response;

        const { created_at, updated_at, ...rest_user_detail_response } = user_detail_response.response;
        const { ...rest_data_sso_token_response } = data_sso_token_response.response;

        httpResponse(req, res, SUCCESS, {
            user_detail: { ...rest_user_detail_response },
            token: { ...rest_data_sso_token_response }
        });
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

/** Update seller detail validation */
const update_seller_detail_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(seller_edit_profile, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Update seller detail sort input data */
const update_seller_detail_input_data_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];
        const data = await sort_edit_seller_input_data({ ...req.body, uid });
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

/** Update seller detail document */
const update_seller_detail_middleware = async (req, res, next) => {
    try {
        let { query, request_data_user_detail } = req[REQUEST_DATA];

        const { status, response } = await get_seller_detail(query);

        if (status === SUCCESS) {
            const data = await edit_seller_detail(request_data_user_detail);

            if(data.status === SUCCESS) httpResponse(req, res, data.status, data.response)
            else next(httpResponse(req, res, data.status, data.response));
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
    seller_signup_validation,
    seller_signup_sort_input_data,
    seller_signup_insert_document,

    get_seller_detail_middleware,

    update_seller_detail_validation_middleware,
    update_seller_detail_input_data_middleware,
    update_seller_detail_middleware
}