const mongoose = require('mongoose');
const { COLLECTION_PRODUCT_DISCOUNT } = require("../constants/collection.constants");
const { SUCCESS, PRESENT, ERROR, NOT_VALID, DEACTIVE, NO_VALUE } = require("../constants/common.constants");
var { validate } = require('../schema');
var uuid = require('uuid/v4');
var { encryptData } = require("../controller/response.controller");

const product_discount_collection = mongoose.model(COLLECTION_PRODUCT_DISCOUNT);

/** Sort insert single product discount input data */
const sort_single_product_discount_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { discount, product_id } = data;

        try {
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    product_id
                },
                insert: {
                    discount,
                    product: product_id,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update or Insert single product discount detail */
const insert_or_update_single_product_discount_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await product_discount_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get product discount */
const get_product_discount_controller = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const product_discount_collection = await product_discount_collection.findOne(query, { updated_at: 0 });

            if (product_discount_collection && product_discount_collection._id) {
                return resolve({ status: SUCCESS, response: product_discount_collection.toJSON() });
            }

            resolve({ status: NO_VALUE, response: {} });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

module.exports = {
    sort_single_product_discount_input_data_controller,
    insert_or_update_single_product_discount_detail_controller,

    get_product_discount_controller
}