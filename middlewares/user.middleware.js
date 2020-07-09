var {
    registeration,
    login,
    session_login,
    refresh_token,
    logout,
    user_forgot_password_reset_password_schema,
    user_forgot_password_schema
} = require("../schema/user.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    insert_user_detail,
    insert_user_information,
    insert_sso_token,
    insert_device_token,
    find_user,
    sort_insert_user_input_data,
    sort_login_user_input_data: login_sort_input_data_controller,
    get_user_detail,
    check_credentials,
    get_sso_user_token,
    get_user_information,

    sort_session_login_user_input_data_controller,
    sort_refresh_token_input_data_controller,
    update_sso_token_controller,

    sort_logout_input_data_controller,

    update_device_token_controller,

    update_user_information_controller,

    sort_update_user_forgot_password_input_data_controller,

    sort_update_user_forgot_password_reset_password_input_data_controller
} = require("../controller/user.controller");
const {
    get_admin_user_detail_controller
} = require("../controller/admin.controller");
const {
    get_content_writer_user_detail_controller
} = require("../controller/content.writer.controller");
const {
    get_sails_user_detail_controller
} = require("../controller/sails.controller");

var {
    get_message_provider_controller,
    send_mail_controller
} = require("../controller/message.controller");

const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA, USER_TYPE_SUPER_ADMIN, USER_TYPE_MARKETING, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER, USER_TYPE_USER } = require('../constants/common.constants');
var { ObjectId } = require('mongodb');

/** Signup validation */
const signup_validation = async (req, res, next) => {
    try {
        const data = await validate(registeration, req.body);
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
                insert_user_detail(request_data_user_detail),
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
        const { query_to_update_sso_token_and_device_token, request_data_user_infromation, request_data_device_token, request_data_sso_token } = req[REQUEST_DATA];

        const data = await check_credentials(request_data_user_infromation);
        const { status, response } = data;

        if (status === SUCCESS) {
            //Update uid in request data to validate them
            request_data_device_token.uid = response._id;
            request_data_sso_token.uid = response._id;
            query_to_update_sso_token_and_device_token.uid = response._id;
            const { account, user_type } = response;

            let get_user_detail_func = null;
            switch (response.user_type) {
                case USER_TYPE_SUPER_ADMIN:
                    get_user_detail_func = get_admin_user_detail_controller;
                    break;
                case USER_TYPE_MARKETING:
                    get_user_detail_func = get_sails_user_detail_controller;
                    break;
                case USER_TYPE_CONTENT_WRITER:
                    get_user_detail_func = get_content_writer_user_detail_controller;
                    break;
                case USER_TYPE_SELLER:
                    get_user_detail_func = get_sails_user_detail_controller;
                    break;
                case USER_TYPE_USER:
                    get_user_detail_func = get_user_detail;
                    break;
            }

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                get_user_detail_func({ uid: response._id }),
                insert_sso_token(query_to_update_sso_token_and_device_token, request_data_sso_token),
                insert_device_token(query_to_update_sso_token_and_device_token, request_data_device_token)
            ]);

            const [user_detail_response, data_sso_token_response] = save_user_detail_response;

            const { created_at, updated_at, ...rest_user_detail_response } = user_detail_response.response;
            const { device_signature, created_at: token_created_at, updated_at: token_updated_at, ...rest_data_sso_token_response } = data_sso_token_response.response || {};

            httpResponse(req, res, SUCCESS, {
                user_detail: { user_type, account, ...rest_user_detail_response },
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

/** Session login validation */
const session_login_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(session_login, req.params);
        req.params = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Session login sort input data */
const session_login_sort_input_data_middleware = async (req, res, next) => {
    try {
        const { uid, access_token } = req[AUTH_DATA];
        const data = await sort_session_login_user_input_data_controller({ uid, access_token, ...req.params });
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

/** Session login or Refresh token check credentials */
const session_login_or_refresh_token_check_credentials_middleware = async (req, res, next) => {
    try {
        const { query, update } = req[REQUEST_DATA];
        // console.log(query, update);

        const data = await update_sso_token_controller(query, update);
        const { status, response } = data;

        if (status === SUCCESS) {
            const { uid, user_type, account } = req[AUTH_DATA];
            const { device_signature } = req.params;

            let get_user_detail_func = null;
            switch (user_type) {
                case USER_TYPE_SUPER_ADMIN:
                    get_user_detail_func = get_admin_user_detail_controller;
                    break;
                case USER_TYPE_MARKETING:
                    get_user_detail_func = get_sails_user_detail_controller;
                    break;
                case USER_TYPE_CONTENT_WRITER:
                    get_user_detail_func = get_content_writer_user_detail_controller;
                    break;
                case USER_TYPE_SELLER:
                    get_user_detail_func = get_sails_user_detail_controller;
                    break;
                case USER_TYPE_USER:
                    get_user_detail_func = get_user_detail;
                    break;
            }

            //Save user detail response
            const save_user_detail_response = await Promise.all([
                get_user_detail_func({ uid }),
                get_sso_user_token({ uid, device_signature })
            ]);

            const [user_detail_response, data_sso_token_response] = save_user_detail_response;

            const { created_at, updated_at, ...rest_user_detail_response } = user_detail_response.response;
            const { device_signature: sso_token_device_signature, created_at: token_created_at, updated_at: token_updated_at, ...rest_data_sso_token_response } = data_sso_token_response.response;

            httpResponse(req, res, SUCCESS, {
                user_detail: { user_type, account, ...rest_user_detail_response },
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

/** Refresh access token validation */
const refresh_token_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(refresh_token, req.params);
        req.params = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Refresh access token sort input data */
const refresh_access_token_sort_input_data_middleware = async (req, res, next) => {
    try {
        const { uid, refresh_token } = req[AUTH_DATA];
        const data = await sort_refresh_token_input_data_controller({ uid, refresh_token, ...req.params });
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

/** Logout validation */
const logout_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(logout, req.params);
        console.log(req.params, data);

        req.params = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Logout sort input data */
const logout_sort_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_logout_input_data_controller(req.params);
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

/** Logout check credentials */
const logout_check_credentials_middleware = async (req, res, next) => {
    try {
        const { query, update } = req[REQUEST_DATA];

        await Promise.all([
            update_sso_token_controller(query, update),
            update_device_token_controller(query, update)
        ]);

        //Save user detail response
        const save_user_detail_response = await Promise.all([
            get_sso_user_token(query)
        ]);

        const [data_sso_token_response] = save_user_detail_response;

        const { device_signature: sso_token_device_signature, created_at: token_created_at, updated_at: token_updated_at, ...rest_data_sso_token_response } = data_sso_token_response.response;

        httpResponse(req, res, SUCCESS, { status: update.status });
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

/** User forgot password validation */
const user_forgot_password_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(user_forgot_password_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** User forogot password sort input data */
const user_sort_forgot_password_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_update_user_forgot_password_input_data_controller(req.body);
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

/** User forogt password */
const user_forgot_password_middleware = async (req, res, next) => {
    try {
        const { email, ...rest } = req[REQUEST_DATA];

        const data = await get_user_information({ email });
        const { status, response } = data;

        if (status === SUCCESS) {

            //Save user inforation response
            const { status, response } = await update_user_information_controller(
                { email },
                { $set: { ...rest } }
            );

            console.log("status ===> ", status);

            //Send email notification
            const query = {
                $or: [
                    {
                        $and: [
                            {
                                used_emails_today: { $lte: 250 }
                            }, {
                                updated_at: { $eq: new Date().toISOString() }
                            }
                        ]
                    },
                    {
                        updated_at: { $lte: new Date().toISOString() }
                    }
                ]
            };
            const { status: message_provider_status, response: message_provider_response } = get_message_provider_controller(query, {});

            console.log("message_provider_response ===> ", message_provider_response, JSON.stringify(query));
            httpResponse(req, res, status, response);

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


/** User forgot password reset password validation */
const user_forgot_password_reset_password_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(user_forgot_password_reset_password_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** User forogot password reset password sort input data */
const user_sort_forgot_password_reset_password_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_update_user_forgot_password_reset_password_input_data_controller(req.body);
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

/** User forogt password reset password*/
const user_forgot_password_reset_password_middleware = async (req, res, next) => {
    try {
        const { query, update } = req[REQUEST_DATA];

        const data = await get_user_information(query);
        const { status, response } = data;

        if (status === SUCCESS) {

            //Save user inforation response
            const { status, response } = await update_user_information_controller(
                query,
                { $set: update }
            );

            httpResponse(req, res, status, response);

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
    signup_validation,
    signup_insert_document,
    signup_sort_input_data,

    login_validation,
    login_check_credentials,
    login_sort_input_data,

    get_user_detail_middleware,

    session_login_validation_middleware,
    session_login_sort_input_data_middleware,
    session_login_or_refresh_token_check_credentials_middleware,

    refresh_access_token_sort_input_data_middleware,
    refresh_token_validation_middleware,

    logout_validation_middleware,
    logout_sort_input_data_middleware,
    logout_check_credentials_middleware,

    user_forgot_password_validation_middleware,
    user_sort_forgot_password_input_data_middleware,
    user_forgot_password_middleware,

    user_forgot_password_reset_password_validation_middleware,
    user_sort_forgot_password_reset_password_input_data_middleware,
    user_forgot_password_reset_password_middleware
}