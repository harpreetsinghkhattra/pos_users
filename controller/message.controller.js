var mongoose = require('mongoose');
const { COLLECTION_MESSAGE_PROVIDER_INFORMATION } = require("../constants/collection.constants");
const { MODEL_VALIDATION_ERROR, SUCCESS, PRESENT, ERROR, NOT_VALID, ACTIVE, DEACTIVE } = require("../constants/common.constants");
var { validate } = require('../schema');

const message_collection = mongoose.model(COLLECTION_MESSAGE_PROVIDER_INFORMATION);

/** Validate message provider model */
const validate_message_provider_model = (schema, obj = {}) => {
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

/** Sort insert message provider input data */
const sort_insert_message_provider_input_data = async (data, auth_user) => {
    return new Promise((resolve, reject) => {
        try {
            var { host, port, username, password, total_emails, account_created_date } = data;
            let { _id } = auth_user;
            var dates = {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            resolve({
                request_message_provider_data: {
                    created_by: _id,
                    host,
                    port,
                    username,
                    password,
                    total_emails,
                    account_created_date,
                    status: ACTIVE,
                    deleted_status: DEACTIVE,
                    ...dates
                }
            });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert message provider detail */
const insert_message_provider_detail = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await message_collection.create(data);
            resolve({ status: SUCCESS, response: res.toJSON() });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Find Message Provider */
const find_message_provider = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const res = await message_collection.findOne(query, { _id: 1 });

            if (res && res._id) {
                reject({ status: PRESENT, response: res.toJSON() });
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

/** List Message Provider */
const list_message_provider_controller = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const data = await message_collection.aggregate(query);

            resolve({
                status: SUCCESS,
                response: data
            })

        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get Message Provider */
const get_message_provider_controller = async (query = null, projection = { password: 0 }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const data = await message_collection.findOne(query, projection);

            resolve({
                status: SUCCESS,
                response: data.toJSON()
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Send mail */
const send_mail_controller = async (prodvider_detail) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!prodvider_detail) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            //Message provider detail
            const { username, password, host, port } = prodvider_detail;

            let transporter = nodemailer.createTransport({
                host: host,
                port: port,
                secure: false,
                auth: {
                    user: username,
                    pass: password
                },
            });

            let info = await transporter.sendMail({
                from: 'pos1592733811749@outlook.com', // sender address
                to: "posprovidertpsharma@mailinator.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            resolve({
                status: SUCCESS,
                response: {}
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

module.exports = {
    validate_message_provider_model,
    sort_insert_message_provider_input_data,
    insert_message_provider_detail,
    find_message_provider,
    list_message_provider_controller,
    get_message_provider_controller,
    send_mail_controller
}