var {
    admin_login_schema,
    admin_registeration_schema,
    admin_forgot_password_schema,
    admin_forgot_password_reset_password_schema,
    admin_change_password_schema,

    admin_edit_profile_schema
} = require("../schema/admin.schema");
var { validate } = require('../schema');
const { httpResponse } = require("../controller/response.controller");
const {
    insert_user_information,
    insert_sso_token,
    insert_device_token,
    find_user,
    get_user_detail,
    get_user_information,
    check_credentials,
    get_sso_user_token,

    update_user_information_controller,

    sort_update_user_forgot_password_input_data_controller,

    sort_update_user_forgot_password_reset_password_input_data_controller,

    sort_user_change_password_input_data_controller
} = require("../controller/user.controller");
const {
    sort_insert_admin_user_input_data_controller,
    insert_admin_detail_controller,
    get_admin_user_detail_controller,

    sort_edit_admin_input_data_controller,
    edit_admin_detail_controller
} = require("../controller/admin.controller");
const { VALIDATION_ERROR, REQUEST_DATA, SUCCESS, AUTH_DATA } = require('../constants/common.constants');

/** Admin signup validation */
const admin_signup_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(admin_registeration_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Admin signup sort input data */
const admin_signup_sort_input_data_middleware = async (req, res, next) => {
    try {
        const data = await sort_insert_admin_user_input_data_controller(req.body);
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
const admin_signup_insert_document_middleware = async (req, res, next) => {
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
                insert_admin_detail_controller(request_data_user_detail),
                insert_sso_token(query, request_data_sso_token),
                insert_device_token(query, request_data_device_token)
            ]);

            const [user_detail_response, data_sso_token_response] = save_user_detail_response;
            console.log("save_user_detail_response ===>", data_sso_token_response, request_data_sso_token);

            const { created_at, updated_at, ...rest_user_detail_response } = user_detail_response.response;
            const { device_signature, created_at: token_created_at, updated_at: token_updated_at, ...rest_data_sso_token_response } = data_sso_token_response.response || {};

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

/** Admin login validation */
const admin_login_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(admin_login_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Admin login check credentials */
const admin_login_check_credentials_middleware = async (req, res, next) => {
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
                get_admin_user_detail_controller({ uid: response._id }),
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

/** Get admin user detail */
const get_admin_user_detail_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];
        console.log("uid ===> ", uid);

        //Get user detail response
        const save_user_detail_response = await Promise.all([
            get_admin_user_detail_controller({ uid: uid }),
            get_sso_user_token({ uid: uid })
        ]);

        console.log("save_user_detail_response ===> ", save_user_detail_response);

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

/** Admin forgot password validation */
const admin_forgot_password_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(admin_forgot_password_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Admin forogot password sort input data */
const admin_sort_forogt_password_input_data_middleware = async (req, res, next) => {
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

/** Admin forogt password */
const admin_forgot_password_middleware = async (req, res, next) => {
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


/** Admin forgot password reset password validation */
const admin_forgot_password_reset_password_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(admin_forgot_password_reset_password_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Admin forogot password reset password sort input data */
const admin_sort_forgot_password_reset_password_input_data_middleware = async (req, res, next) => {
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

/** Admin forogt password reset password*/
const admin_forgot_password_reset_password_middleware = async (req, res, next) => {
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

/** Admin change password validation */
const admin_change_password_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(admin_change_password_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Admin change password sort input data */
const admin_sort_change_password_input_data_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];
        const data = await sort_user_change_password_input_data_controller({ _id: uid, ...req.body });
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

/** Admin change password*/
const admin_change_password_middleware = async (req, res, next) => {
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

/** Update admin detail validation */
const update_admin_detail_validation_middleware = async (req, res, next) => {
    try {
        const data = await validate(admin_edit_profile_schema, req.body);
        req.body = data;
        next();
    } catch (error) {
        next(httpResponse(req, res, VALIDATION_ERROR, error))
    }
}

/** Update admin detail sort input data */
const update_admin_detail_input_data_middleware = async (req, res, next) => {
    try {
        const { uid } = req[AUTH_DATA];
        const data = await sort_edit_admin_input_data_controller({ ...req.body, uid });
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

/** Update admin detail document */
const update_admin_detail_middleware = async (req, res, next) => {
    try {
        let { query, request_data_user_detail } = req[REQUEST_DATA];

        const { status, response } = await get_admin_user_detail_controller(query);

        if (status === SUCCESS) {
            const data = await edit_admin_detail_controller(request_data_user_detail);

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
    admin_signup_validation_middleware,
    admin_signup_insert_document_middleware,
    admin_signup_sort_input_data_middleware,

    admin_login_validation_middleware,
    admin_login_check_credentials_middleware,

    get_admin_user_detail_middleware,

    admin_forgot_password_validation_middleware,
    admin_sort_forogt_password_input_data_middleware,
    admin_forgot_password_middleware,

    admin_forgot_password_reset_password_validation_middleware,
    admin_sort_forgot_password_reset_password_input_data_middleware,
    admin_forgot_password_reset_password_middleware,

    admin_change_password_validation_middleware,
    admin_sort_change_password_input_data_middleware,
    admin_change_password_middleware,

    update_admin_detail_validation_middleware,
    update_admin_detail_input_data_middleware,
    update_admin_detail_middleware
}