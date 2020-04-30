var { registeration, login } = require("../schema/user.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const { insert_user_detail, insert_user_information, insert_sso_token, insert_device_token, find_user, validate_user_model, sort_insert_user_input_data, sort_login_user_input_data: login_sort_input_data_controller, get_user_detail, get_user_information, check_credentials, get_sso_user_token } = require("../controller/user.controller");
const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA } = require('../constants/common.constants');
var { user_detail, user_information, sso_tokens, device_tokens } = require("../models/user_detail.model");
var { ObjectId } = require('mongodb');

/** Signup validation */
const signup_validation = async (req, res, next) => {
    try {
        const data = await validate(login, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Signup sort input data */
const signup_sort_input_data = async (req, res, next) => {
    try {
        const data = await sort_insert_user_input_data(req.body);
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
const signup_insert_document = async (req, res, next) => {
    try {
        console.log("Signup insert document");
        let { request_data_user_detail, request_data_user_infromation, request_data_device_token, request_data_sso_token } = req[REQUEST_DATA];

        //Add user information
        await validate_user_model(user_information, request_data_user_infromation);

        await find_user({ email: req.body.email });
        const data = await insert_user_information(request_data_user_infromation);
        const { status, response } = data;

        if (status === SUCCESS) {
            //Update uid in request data to validate them
            request_data_user_detail.uid = response._id;
            request_data_device_token.uid = response._id;
            request_data_sso_token.uid = response._id;

            await Promise.all([
                validate_user_model(user_detail, request_data_user_detail),
                validate_user_model(device_tokens, request_data_device_token),
                validate_user_model(sso_tokens, request_data_sso_token)
            ]);

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                insert_user_detail(request_data_user_detail),
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

/** Login validation */
const login_validation = async (req, res, next) => {
    try {
        const data = await validate(login, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Login sort input data */
const login_sort_input_data = async (req, res, next) => {
    try {
        const data = await login_sort_input_data_controller(req.body);
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

/** Login check credentials */
const login_check_credentials = async (req, res, next) => {
    try {
        console.log("Login check credentials");
        const { request_data_user_infromation, request_data_device_token, request_data_sso_token } = req[REQUEST_DATA];

        const data = await check_credentials(request_data_user_infromation);
        const { status, response } = data;

        if (status === SUCCESS) {
            //Update uid in request data to validate them
            request_data_device_token.uid = response._id;
            request_data_sso_token.uid = response._id;

            await Promise.all([
                validate_user_model(device_tokens, request_data_device_token),
                validate_user_model(sso_tokens, request_data_sso_token)
            ]);

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                get_user_detail({ uid: response._id }),
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

/** Get user detail */
const get_user_detail_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];

        //Save user detail response
        const save_user_detail_response = await Promise.all([
            get_user_detail({ uid: ObjectId(uid) }),
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

module.exports = {
    signup_validation,
    signup_insert_document,
    signup_sort_input_data,

    login_validation,
    login_check_credentials,
    login_sort_input_data,

    get_user_detail_middleware
}