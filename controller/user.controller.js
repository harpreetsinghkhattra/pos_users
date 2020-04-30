const { getDB } = require("../db/connection.db");
const { COLLECTION_USER_DETAIL, COLLECTION_SSO_TOKENS, COLLECTION_USER_INFORMATION, COLLECTION_DEVICE_TOKENS } = require("../constants/collection.constants");
const { MODEL_VALIDATION_ERROR, SUCCESS, PRESENT, ERROR, NOT_VALID, USER_TYPE_COOK, LOGIN_TYPE_CUSTOM_USER, ACTIVE, DEACTIVE, NO_VALUE } = require("../constants/common.constants");
var { validate } = require('../schema');
var uuid = require('uuid/v4');
var { encryptData } = require("../controller/response.controller");

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

            var { first_name, last_name, email, password, token = null, device_type } = data;
            var dates = {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            Promise.all([
                encryptData(salt, _access_token),
                encryptData(salt, _refresh_token),
                encryptData(salt, password)
            ]).then(([access_token, refresh_token, _password]) => {
                console.log("access_token, refresh_token, _password, token ===> ", access_token, refresh_token, _password);
                resolve({
                    request_data_user_detail: {
                        first_name,
                        last_name,
                        email,
                        ...dates
                    },
                    request_data_user_infromation: {
                        user_type: USER_TYPE_COOK,
                        login_type: LOGIN_TYPE_CUSTOM_USER,
                        email: email ? email.trim().toLowerCase() : "",
                        password: _password,
                        salt,
                        status: ACTIVE,
                        delete_status: DEACTIVE,
                        ...dates
                    },
                    request_data_device_token: {
                        token,
                        device_type,
                        status: ACTIVE,
                        ...dates
                    },
                    request_data_sso_token: {
                        access_token,
                        refresh_token,
                        expires_in,
                        device_signature: null,
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
            const user_detail = getDB().collection(COLLECTION_USER_DETAIL);
            const res = await user_detail.insertOne(data);
            resolve({ status: SUCCESS, response: res.ops[0] });
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
            const device_tokens = getDB().collection(COLLECTION_DEVICE_TOKENS);
            const token_detail = await device_tokens.findOne(query, { projection: { token: 1 } });
            if (token_detail && token_detail.token) {
                resolve({ status: PRESENT, response: token_detail });
            } else resolve({ status: SUCCESS, response: {} });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert device token */
const insert_device_token = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const device_tokens = getDB().collection(COLLECTION_DEVICE_TOKENS);
            const check_device_token_response = await find_device_token({ uid: data.uid, token: data.token, device_type: data.device_type });
            const { status, response } = check_device_token_response;
            if (status === SUCCESS) {
                const res = await device_tokens.insertOne(data);
                resolve({ status: SUCCESS, response: res.ops[0] });
            } else resolve({ status, response });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert user information */
const insert_user_information = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user_detail = getDB().collection(COLLECTION_USER_INFORMATION);
            const res = await user_detail.insertOne(data);
            resolve({ status: SUCCESS, response: res.ops[0] });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert SSO token */
const insert_sso_token = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user_detail = getDB().collection(COLLECTION_SSO_TOKENS);
            const res = await user_detail.insertOne(data);
            resolve({ status: SUCCESS, response: res.ops[0] });
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
            const user_detail = getDB().collection(COLLECTION_USER_INFORMATION);
            const res = await user_detail.findOne(query, { projection: { email: 1, _id: 1 } });

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
            const user_information = getDB().collection(COLLECTION_USER_INFORMATION);

            const user = await user_information.findOne(query, { projection: { _id: 1 } });

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
            const user_detail = getDB().collection(COLLECTION_USER_INFORMATION);
            const user = await user_detail.findOne(query, { projection: { email: 1, _id: 1, salt: 1 } });

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
            const sso_user = getDB().collection(COLLECTION_SSO_TOKENS);
            const user = await sso_user.findOne(query, { projection: { status: 0, device_signature: 0 } });

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

/** Get user detail */
const get_user_detail = async (query = null, options = { rejectResponse: { status: NO_VALUE, response: "No user found" } }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const user_detail = getDB().collection(COLLECTION_USER_DETAIL);
            const user = await user_detail.findOne(query, { projection: { created_at: 0, updated_at: 0, _id: 0 } });

            if (user && user.uid) {
                resolve({ status: SUCCESS, response: user });
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

            var { email, password, token = null, device_type } = data;
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
                request_data_user_infromation: {
                    email,
                    password: _password
                },
                request_data_device_token: {
                    token,
                    device_type,
                    status: ACTIVE,
                    ...dates
                },
                request_data_sso_token: {
                    access_token,
                    refresh_token,
                    expires_in,
                    device_signature: null,
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
    get_sso_user_token
}