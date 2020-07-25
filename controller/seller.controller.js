const mongoose = require('mongoose');
const { COLLECTION_SELLER_USER_DETAIL, COLLECTION_USER_DETAIL, COLLECTION_SSO_TOKENS, COLLECTION_USER_INFORMATION, COLLECTION_DEVICE_TOKENS } = require("../constants/collection.constants");
const { MODEL_VALIDATION_ERROR, ACCOUNT_NOT_VERIFIED, SUCCESS, PRESENT, ERROR, NOT_VALID, USER_TYPE_USER, LOGIN_TYPE_CUSTOM_USER, ACTIVE, DEACTIVE, NO_VALUE, USER_TYPE_SUPER_ADMIN, USER_TYPE_SELLER } = require("../constants/common.constants");
var { validate } = require('../schema');
var uuid = require('uuid/v4');
var { encryptData } = require("../controller/response.controller");

const seller_detail_collection = mongoose.model(COLLECTION_SELLER_USER_DETAIL);

/** Validate seller model */
const validate_seller_model = (schema, obj = {}) => {
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

/** Sort insert seller input data */
const sort_insert_seller_input_data = async (data) => {
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
                created_at: new Date(),
                updated_at: new Date()
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
                        user_type: USER_TYPE_SELLER,
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

/** Insert seller detail */
const insert_seller_detail = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await seller_detail_collection.create(data);
            resolve({ status: SUCCESS, response: res._doc });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get seller detail */
const get_seller_detail = async (query = null, options = { rejectResponse: { status: NO_VALUE, response: "No user found" } }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const user = await seller_detail_collection.findOne(query, { created_at: 0, updated_at: 0, _id: 0 });

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

/** Validate edit seller model */
const validate_edit_seller_model = (schema, obj = {}) => {
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

/** Sort edit seller input data */
const sort_edit_seller_input_data = async (data) => {
    return new Promise((resolve, reject) => {
        try {

            var { first_name, last_name, mobile_code, mobile_number, uid } = data;
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    uid
                },
                request_data_user_detail: {
                    first_name,
                    last_name,
                    mobile_code,
                    mobile_number,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Edit seller detail */
const edit_seller_detail = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await seller_detail_collection.updateOne(query, data);
            const res = await seller_detail_collection.findOne(query);
            resolve({ status: SUCCESS, response: res._doc });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

module.exports = {
    validate_seller_model,
    sort_insert_seller_input_data,
    insert_seller_detail,

    get_seller_detail,

    validate_edit_seller_model,
    sort_edit_seller_input_data,
    edit_seller_detail
}