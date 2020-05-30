const mongoose = require('mongoose');
const { COLLECTION_USER_DETAIL, COLLECTION_SSO_TOKENS, COLLECTION_USER_INFORMATION, COLLECTION_DEVICE_TOKENS } = require("../constants/collection.constants");
const { MODEL_VALIDATION_ERROR, ACCOUNT_NOT_VERIFIED, SUCCESS, PRESENT, ERROR, NOT_VALID, USER_TYPE_USER, LOGIN_TYPE_CUSTOM_USER, ACTIVE, DEACTIVE, NO_VALUE, USER_TYPE_SUPER_ADMIN } = require("../constants/common.constants");
var { validate } = require('../schema');
var uuid = require('uuid/v4');
var { encryptData } = require("../controller/response.controller");

const user_detail_collection = mongoose.model(COLLECTION_USER_DETAIL);
const user_information_collection = mongoose.model(COLLECTION_USER_INFORMATION);
const device_tokens_collection = mongoose.model(COLLECTION_DEVICE_TOKENS);
const sso_tokens_collection = mongoose.model(COLLECTION_SSO_TOKENS);

/** Validate user model */
const validate_user_model = (schema, obj = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            await validate(schema, obj);
            resolve({
                status: SUCCESS,
                response: null
            });
        } catch (error) {
            console.log("validation error ===> ", error);
            reject({
                status: MODEL_VALIDATION_ERROR,
                response: error
            })
        }
    })
}

/** Sort insert user input data */
const sort_insert_user_input_data = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            var salt = uuid();
            var _access_token = uuid();
            var _refresh_token = uuid();

            /** 48 hours */
            var date = new Date();
            date.setDate(date.getDate() + 2);
            var expires_in = (date.getTime() - new Date().getTime()) / (1000);

            var { first_name, last_name, email, password, token = null, device_type, device_signature } = data;
            var dates = {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            Promise.all([
                encryptData(salt, _access_token),
                encryptData(salt, _refresh_token),
                encryptData(salt, password)
            ]).then(([access_token, refresh_token, _password]) => {
                resolve({
                    request_data_user_detail: {
                        first_name,
                        last_name,
                        email,
                        ...dates
                    },
                    request_data_user_infromation: {
                        user_type: USER_TYPE_USER,
                        login_type: LOGIN_TYPE_CUSTOM_USER,
                        email: email ? email.trim().toLowerCase() : "",
                        password: _password,
                        salt,
                        account: ACCOUNT_NOT_VERIFIED,
                        status: ACTIVE,
                        delete_status: DEACTIVE,
                        ...dates
                    },
                    request_data_device_token: {
                        token,
                        device_type,
                        device_signature,
                        status: ACTIVE,
                        ...dates
                    },
                    request_data_sso_token: {
                        access_token,
                        refresh_token,
                        expires_in,
                        device_signature,
                        status: ACTIVE,
                        ...dates
                    }
                })
            }).catch(error => {
                console.log("Signup sort input data ===> during access_token", error);
                reject({ status: ERROR, response: error });
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert user detail */
const insert_user_detail = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await user_detail_collection.create(data);
            resolve({ status: SUCCESS, response: res._doc });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Find device token */
const find_device_token = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const token_detail = await device_tokens_collection.findOne(query, { token: 1 });
            if (token_detail && token_detail.token) {
                resolve({ status: PRESENT, response: token_detail });
            } else resolve({ status: SUCCESS, response: {} });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert device token */
const insert_device_token = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await device_tokens_collection.findOneAndUpdate(query, data, { runValidators: true, upsert: true });
            resolve({ status: SUCCESS, response: res && res.toJSON() || data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert user information */
const insert_user_information = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await user_information_collection.create(data);
            resolve({ status: SUCCESS, response: res._doc });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert SSO token */
const insert_sso_token = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await sso_tokens_collection.updateOne(query, data, { runValidators: true, upsert: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Find User */
const find_user = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const res = await user_information_collection.findOne(query, { email: 1, _id: 1 });

            if (res && res._id) {
                reject({ status: PRESENT, response: res });
                return;
            }

            resolve({
                status: SUCCESS,
                response: res
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Check credentials */
const check_credentials = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const user = await user_information_collection.findOne(query, { _id: 1, user_type: 1, account: 1, status: 1 });

            if (user && user._id) {
                resolve({
                    status: SUCCESS,
                    response: user
                })
            } else {
                reject({
                    status: NOT_VALID,
                    response: "email or password is incorrect."
                })
            }

        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get user information */
const get_user_information = async (query = null, options = { rejectResponse: { status: NO_VALUE, response: "No user found" } }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const user = await user_information_collection.findOne(query, { email: 1, _id: 1, salt: 1, user_type: 1 });

            if (user && user._id) {
                resolve({ status: SUCCESS, response: user });
            } else {
                reject(options.rejectResponse);
            }
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get user tokens */
const get_sso_user_token = async (query = null, options = { rejectResponse: { status: NO_VALUE, response: "No user found" } }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const user = await sso_tokens_collection.findOne(query, { status: 0, device_signature: 0, updated_at: 0, created_at: 0 });

            if (user && user._id) {
                resolve({ status: SUCCESS, response: user.toJSON() });
            } else {
                reject(options.rejectResponse);
            }
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get user detail */
const get_user_detail = async (query = null, options = { rejectResponse: { status: NO_VALUE, response: "No user found" } }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const user = await user_detail_collection.findOne(query, { created_at: 0, updated_at: 0, _id: 0 });

            if (user && user.uid) {
                resolve({ status: SUCCESS, response: user.toJSON() });
            } else {
                reject(options.rejectResponse);
            }
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort login user input data */
const sort_login_user_input_data = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var _access_token = uuid();
            var _refresh_token = uuid();

            /** 48 hours */
            var date = new Date();
            date.setDate(date.getDate() + 2);
            var expires_in = (date.getTime() - new Date().getTime()) / (1000);

            var { email, password, token = null, device_type, device_signature } = data;
            var user_data = await get_user_information({ email }, { rejectResponse: { status: NOT_VALID, response: "either email or password is incorrect." } });
            const { salt } = user_data && user_data.response || {};

            var dates = {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const request_input_data = await Promise.all([
                encryptData(salt, _access_token),
                encryptData(salt, _refresh_token),
                encryptData(salt, password)
            ])

            const [access_token, refresh_token, _password] = request_input_data;

            resolve({
                query_to_update_sso_token_and_device_token: {
                    device_signature
                },
                request_data_user_infromation: {
                    email,
                    password: _password
                },
                request_data_device_token: {
                    token,
                    device_type,
                    device_signature,
                    status: ACTIVE,
                    ...dates
                },
                request_data_sso_token: {
                    access_token,
                    refresh_token,
                    expires_in,
                    device_signature,
                    status: ACTIVE,
                    ...dates
                }
            });

        } catch (error) {
            const status = error && error.status || ERROR;
            const response = error && error.response || error;

            reject({ status, response });
        }
    });
}

/** Sort user forgot password input data */
const sort_update_user_forgot_password_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            var _password_access_token = uuid();

            var { email } = data;
            var dates = {
                updated_at: new Date().toISOString()
            }

            resolve({
                email,
                forgot_password_access_token: _password_access_token,
                ...dates
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update user information detail */
const update_user_information_controller = async (filter, update) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await user_information_collection.updateOne(filter, update, { runValidators: true });
            resolve({ status: SUCCESS, response: res });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort user forgot password reset password input data */
const sort_update_user_forgot_password_reset_password_input_data_controller = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var { new_password, forgot_password_access_token } = data;
            var user_data = await get_user_information({ forgot_password_access_token }, { rejectResponse: { status: NOT_VALID, response: "Forgot password access token not found, please try again." } });
            const { salt } = user_data && user_data.response || {};

            var dates = {
                updated_at: new Date()
            }

            const request_input_data = await Promise.all([
                encryptData(salt, new_password)
            ])

            const [_password] = request_input_data;

            resolve({
                query: {
                    forgot_password_access_token
                },
                update: {
                    forgot_password_access_token: null,
                    password: _password,
                    ...dates
                }
            });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort user change password input data */
const sort_user_change_password_input_data_controller = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var { new_password, _id } = data;
            var user_data = await get_user_information({ _id }, { rejectResponse: { status: NOT_VALID, response: "User not found, please try again." } });
            const { salt } = user_data && user_data.response || {};

            var dates = {
                updated_at: new Date()
            }

            const request_input_data = await Promise.all([
                encryptData(salt, new_password)
            ])

            const [_password] = request_input_data;

            resolve({
                query: {
                    _id
                },
                update: {
                    password: _password,
                    ...dates
                }
            });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort session login user input data */
const sort_session_login_user_input_data_controller = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var _access_token = uuid();
            var _refresh_token = uuid();

            /** 48 hours */
            var date = new Date();
            date.setDate(date.getDate() + 2);
            var expires_in = parseInt((date.getTime() - new Date().getTime()) / (1000));

            var { uid, access_token, device_signature } = data;
            var user_data = await get_user_information({ _id: uid }, { rejectResponse: { status: NOT_VALID, response: "Invalid user ID." } });
            const { salt } = user_data && user_data.response || {};

            var dates = {
                updated_at: new Date().toISOString()
            }

            const request_input_data = await Promise.all([
                encryptData(salt, _access_token),
                encryptData(salt, _refresh_token)
            ])

            const [access_token_res, refresh_token_res] = request_input_data;

            resolve({
                query: {
                    uid,
                    access_token,
                    device_signature
                },
                update: {
                    access_token: access_token_res,
                    refresh_token: refresh_token_res,
                    status: ACTIVE,
                    expires_in,
                    ...dates
                }
            });

        } catch (error) {
            const status = error && error.status || ERROR;
            const response = error && error.response || error;

            reject({ status, response });
        }
    });
}

/** Sort refresh token input data */
const sort_refresh_token_input_data_controller = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var _access_token = uuid();
            var _refresh_token = uuid();

            /** 48 hours */
            var date = new Date();
            date.setDate(date.getDate() + 2);
            var expires_in = parseInt((date.getTime() - new Date().getTime()) / (1000));

            var { uid, device_signature, refresh_token } = data;
            var user_data = await get_user_information({ _id: uid }, { rejectResponse: { status: NOT_VALID, response: "Invalid user ID." } });
            const { salt } = user_data && user_data.response || {};

            var dates = {
                updated_at: new Date().toISOString()
            }

            const request_input_data = await Promise.all([
                encryptData(salt, _access_token),
                encryptData(salt, _refresh_token)
            ])

            const [access_token_res, refresh_token_res] = request_input_data;

            resolve({
                query: {
                    uid,
                    device_signature,
                    refresh_token
                },
                update: {
                    access_token: access_token_res,
                    refresh_token: refresh_token_res,
                    expires_in,
                    status: ACTIVE,
                    ...dates
                }
            });

        } catch (error) {
            console.log(error);
            const status = error && error.status || ERROR;
            const response = error && error.response || error;

            reject({ status, response });
        }
    });
}

/** Update sso token */
const update_sso_token_controller = async (filter, update) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await sso_tokens_collection.updateOne(filter, update, { runValidators: true });

            resolve({ status: SUCCESS, response: res });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update device token */
const update_device_token_controller = async (filter, update) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await device_tokens_collection.updateOne(filter, update, { runValidators: true });

            resolve({ status: SUCCESS, response: res });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort logout input data */
const sort_logout_input_data_controller = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            var { uid, device_signature } = data;
            var user_data = await get_user_information({ _id: uid }, { rejectResponse: { status: NOT_VALID, response: "Invalid user ID." } });
            const { salt } = user_data && user_data.response || {};

            var dates = {
                updated_at: new Date().toISOString()
            }

            resolve({
                query: {
                    uid,
                    device_signature
                },
                update: {
                    status: DEACTIVE,
                    ...dates
                }
            });

        } catch (error) {
            console.log(error);
            const status = error && error.status || ERROR;
            const response = error && error.response || error;

            reject({ status, response });
        }
    });
}


module.exports = {
    insert_user_detail,
    insert_user_information,
    insert_device_token,
    insert_sso_token,
    sort_insert_user_input_data,
    validate_user_model,
    find_user,

    check_credentials,
    sort_login_user_input_data,
    get_user_detail,
    get_user_information,
    get_sso_user_token,

    sort_update_user_forgot_password_input_data_controller,
    update_user_information_controller,

    sort_update_user_forgot_password_reset_password_input_data_controller,

    sort_user_change_password_input_data_controller,

    sort_session_login_user_input_data_controller,
    sort_refresh_token_input_data_controller,
    update_sso_token_controller,

    sort_logout_input_data_controller,

    update_device_token_controller
}