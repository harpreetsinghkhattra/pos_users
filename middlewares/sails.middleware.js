var {
    sails_registeration_schema,
    sails_login_schema,
    sails_forgot_password_schema,
    sails_forgot_password_reset_password_schema,
    sails_change_password_schema
} = require("../schema/sails.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    insert_user_information,
    insert_sso_token,
    insert_device_token,
    find_user,

    check_credentials,
    get_sso_user_token
} = require("../controller/user.controller");
const {
    insert_sails_user_detail_controller,
    sort_insert_sails_user_input_data_controller,
    get_sails_user_detail_controller
} = require("../controller/sails.controller");
const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA } = require('../constants/common.constants');

/** Sails user signup validation */
const sails_user_signup_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(sails_registeration_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sails user signup sort input data */
const sails_user_signup_sort_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_insert_sails_user_input_data_controller(req.body);
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
const sails_user_signup_insert_document_middleware = async (req, res, next) => {
    try {
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
                insert_sails_user_detail_controller(request_data_user_detail),
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

/** Sails user login validation */
const sails_user_login_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(sails_login_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Sails user login check credentials */
const sails_user_login_check_credentials_middleware = async (req, res, next) => {
    try {
        console.log("Login check credentials");
        const { request_data_user_infromation, request_data_device_token, request_data_sso_token } = req[REQUEST_DATA];

        const data = await check_credentials(request_data_user_infromation);
        const { status, response } = data;

        if (status === SUCCESS) {
            //Update uid in request data to validate them
            request_data_device_token.uid = response._id;
            request_data_sso_token.uid = response._id;

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                get_sails_user_detail_controller({ uid: response._id }),
                insert_sso_token(request_data_sso_token),
                insert_device_token(request_data_device_token)
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

/** Get sails user detail */
const get_sails_user_detail_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];

        //Get user detail response
        const save_user_detail_response = await Promise.all([
            get_sails_user_detail_controller({ uid: uid }),
            get_sso_user_token({ uid: uid })
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

module.exports = {
    sails_user_signup_validation_middleware,
    sails_user_signup_insert_document_middleware,
    sails_user_signup_sort_input_data_middleware,

    sails_user_login_validation_middleware,
    sails_user_login_check_credentials_middleware,

    get_sails_user_detail_middleware
}