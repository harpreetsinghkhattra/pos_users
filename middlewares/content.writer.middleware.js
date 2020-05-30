var {
    content_writer_registeration_schema,
    content_writer_login_schema,
    content_writer_edit_profile_schema
} = require("../schema/content.writer.schema");
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
    sort_insert_content_writer_user_input_data_controller,
    insert_content_writer_detail_controller,
    get_content_writer_user_detail_controller,

    sort_edit_content_writer_user_profile_input_data_controller,
    update_content_writer_detail_controller
} = require("../controller/content.writer.controller");
const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA } = require('../constants/common.constants');

/** Cotent writer signup validation */
const content_writer_signup_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(content_writer_registeration_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Content writer signup sort input data */
const content_writer_signup_sort_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_insert_content_writer_user_input_data_controller(req.body);
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
const content_writer_signup_insert_document_middleware = async (req, res, next) => {
    try {
        console.log(req[REQUEST_DATA]);
        let { request_data_user_detail, request_data_user_infromation, request_data_device_token, request_data_sso_token } = req[REQUEST_DATA];

        await find_user({ email: req.body.email });
        const data = await insert_user_information(request_data_user_infromation);
        const { status, response } = data;

        if (status === SUCCESS) {
            //Update uid in request data to validate them
            request_data_user_detail.uid = response._id;
            request_data_device_token.uid = response._id;
            request_data_sso_token.uid = response._id;

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                insert_content_writer_detail_controller(request_data_user_detail),
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

/** Content writer login validation */
const content_writer_login_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(content_writer_login_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Content writer login check credentials */
const content_writer_login_check_credentials_middleware = async (req, res, next) => {
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
                get_content_writer_user_detail_controller({ uid: response._id }),
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

/** Get content writer user detail */
const get_content_writer_user_detail_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];

        //Get user detail response
        const save_user_detail_response = await Promise.all([
            get_content_writer_user_detail_controller({ uid: uid }),
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

/** Cotent writer edit profile validation */
const content_writer_edit_profile_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(content_writer_edit_profile_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Content writer edit profile sort input data */
const content_writer_edit_profile_sort_input_data_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];
        const data = await sort_edit_content_writer_user_profile_input_data_controller({ uid, ...req.body });
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

/** Update document */
const content_writer_edit_profile_insert_document_middleware = async (req, res, next) => {
    try {
        let { query, update } = req[REQUEST_DATA];

        const data = await update_content_writer_detail_controller(query, update);
        const { status, response } = data;

        if (status === SUCCESS) httpResponse(req, res, status, response);    
        else next(httpResponse(req, res, status, response));
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
    content_writer_signup_validation_middleware,
    content_writer_signup_insert_document_middleware,
    content_writer_signup_sort_input_data_middleware,

    content_writer_login_validation_middleware,
    content_writer_login_check_credentials_middleware,

    get_content_writer_user_detail_middleware,

    content_writer_edit_profile_validation_middleware,
    content_writer_edit_profile_sort_input_data_middleware,
    content_writer_edit_profile_insert_document_middleware
}