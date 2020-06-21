var mongoose = require('mongoose');
const { COLLECTION_CONTENT_WRITER_USER_DETAIL } = require("../constants/collection.constants");
const { SUCCESS, ERROR, NOT_VALID, USER_TYPE_CONTENT_WRITER, LOGIN_TYPE_CUSTOM_USER, ACTIVE, DEACTIVE, NO_VALUE, ACCOUNT_VERIFIED } = require("../constants/common.constants");
var uuid = require('uuid/v4');
var { encryptData } = require("../controller/response.controller");

const content_writer_user_detail_collection = mongoose.model(COLLECTION_CONTENT_WRITER_USER_DETAIL);

/** Sort insert content writer input data */
const sort_insert_content_writer_user_input_data_controller = async (data) => {
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
                console.log("access_token, refresh_token, _password, token ===> ", access_token, refresh_token, _password);
                resolve({
                    request_data_user_detail: {
                        first_name,
                        last_name,
                        email,
                        ...dates
                    },
                    request_data_user_infromation: {
                        user_type: USER_TYPE_CONTENT_WRITER,
                        login_type: LOGIN_TYPE_CUSTOM_USER,
                        email: email ? email.trim().toLowerCase() : "",
                        password: _password,
                        salt,
                        status: ACTIVE,
                        account: ACCOUNT_VERIFIED,
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

/** Insert content writer detail */
const insert_content_writer_detail_controller = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await content_writer_user_detail_collection.create(data);
            resolve({ status: SUCCESS, response: res.toJSON() });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get content writer user detail */
const get_content_writer_user_detail_controller = async (query = null, options = { rejectResponse: { status: NO_VALUE, response: "No user found" } }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const user = await content_writer_user_detail_collection.findOne(query, { created_at: 0, updated_at: 0, _id: 0 });

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

/** Sort edit content writer profile input data */
const sort_edit_content_writer_user_profile_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            var { first_name, last_name, mobile_number, uid } = data;

            var dates = {
                updated_at: new Date()
            }

            resolve({
                update: {
                    first_name,
                    last_name,
                    mobile_number,
                    ...dates
                },
                query: {
                    uid
                }
            });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update content writer detail */
const update_content_writer_detail_controller = async (filter, update) => {
    return new Promise(async (resolve, reject) => {
        try {
            await content_writer_user_detail_collection.updateOne(filter, update, { runValidators: true });
            const content_writer_res = await get_content_writer_user_detail_controller(filter);
            resolve(content_writer_res);
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

module.exports = {
    insert_content_writer_detail_controller,
    sort_insert_content_writer_user_input_data_controller,
    get_content_writer_user_detail_controller,

    sort_edit_content_writer_user_profile_input_data_controller,
    update_content_writer_detail_controller
}