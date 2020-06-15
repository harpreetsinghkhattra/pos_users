const mongoose = require('mongoose');
const { COLLECTION_PRODUCT_CATEGORY, COLLECTION_PRODUCT_SUB_CATEGORY, COLLECTION_PRODUCT_SIZE, COLLECTION_PRODUCT_FORM, COLLECTION_PRODUCT, COLLECTION_PRODUCT_TYPE } = require("../constants/collection.constants");
const { MODEL_VALIDATION_ERROR, ACCOUNT_NOT_VERIFIED, SUCCESS, PRESENT, ERROR, NOT_VALID, USER_TYPE_USER, LOGIN_TYPE_CUSTOM_USER, ACTIVE, DEACTIVE, NO_VALUE } = require("../constants/common.constants");
var { validate } = require('../schema');
var uuid = require('uuid/v4');
var { encryptData } = require("../controller/response.controller");

const product_category_collection = mongoose.model(COLLECTION_PRODUCT_CATEGORY);
const product_sub_category_collection = mongoose.model(COLLECTION_PRODUCT_SUB_CATEGORY);
const product_size_collection = mongoose.model(COLLECTION_PRODUCT_SIZE);
const product_form_collection = mongoose.model(COLLECTION_PRODUCT_FORM);
const product_type_collection = mongoose.model(COLLECTION_PRODUCT_TYPE);
const product_detail_collection = mongoose.model(COLLECTION_PRODUCT);

/** Sort insert product category input data */
const sort_product_category_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { name } = data;

        try {
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    name: RegExp(name, "i")
                },
                insert: {
                    name,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update or Insert product category detail */
const insert_or_update_product_category_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product_category_detail = await product_category_collection.findOne(query, { name: 1 }, { runValidators: true });
            if (product_category_detail && product_category_detail._id) return reject({ status: PRESENT, response: product_category_detail.toJSON() });
            await product_category_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get product category */
const get_product_category_controller = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const product_category_detail = await product_category_collection.findOne(query, { updated_at: 0 });

            if (product_category_detail && product_category_detail._id) {
                return resolve({ status: SUCCESS, response: product_category_detail.toJSON() });
            }

            resolve({ status: NO_VALUE, response: product_category_detail.toJSON() });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort insert product sub category input data */
const sort_product_sub_category_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { name, category_id } = data;

        try {
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    name: RegExp(name, "i"),
                    category: category_id
                },
                insert: {
                    name,
                    category: category_id,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update or Insert product sub category detail */
const insert_or_update_product_sub_category_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product_sub_category_detail = await product_sub_category_collection.findOne(query, { name: 1 }, { runValidators: true });
            if (product_sub_category_detail && product_sub_category_detail._id) return reject({ status: PRESENT, response: product_sub_category_detail.toJSON() });
            await product_sub_category_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get product sub category */
const get_product_sub_category_controller = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }

            const product_sub_category_detail = await product_sub_category_collection
                .findOne(query, { updated_at: 0 })
                .populate({
                    path: 'category',
                    select: {
                        updated_at: 0
                    }
                });

            if (product_sub_category_detail && product_sub_category_detail._id) {
                return resolve({ status: SUCCESS, response: product_sub_category_detail.toJSON() });
            }

            resolve({ status: NO_VALUE, response: product_sub_category_detail });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort insert product size input data */
const sort_product_size_insert_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { size, category_id, sub_category_id } = data;

        try {
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    value: RegExp(size, "i"),
                    category: category_id,
                    sub_category: sub_category_id
                },
                insert: {
                    value: size,
                    category: category_id,
                    sub_category: sub_category_id,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update or Insert product size detail */
const insert_or_update_product_size_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product_size_detail = await product_size_collection.findOne(query, { value: 1 }, { runValidators: true });
            if (product_size_detail && product_size_detail._id) return reject({ status: PRESENT, response: product_size_detail.toJSON() });
            await product_size_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get product size */
const get_product_size_controller = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const product_size_detail = await product_size_collection
                .findOne(query, { updated_at: 0 })
                .populate({
                    path: 'category',
                    select: {
                        name: 1
                    }
                })
                .populate({
                    path: 'sub_category',
                    select: {
                        name: 1
                    }
                });

            if (product_size_detail && product_size_detail._id) {
                return resolve({ status: SUCCESS, response: product_size_detail.toJSON() });
            }

            resolve({ status: NO_VALUE, response: product_size_detail.toJSON() });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort insert product form input data */
const sort_product_form_insert_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { name, category_id, sub_category_id, form_keys } = data;

        try {
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    name: RegExp(name, "i")
                },
                insert: {
                    name,
                    form_keys,
                    category: category_id,
                    sub_category: sub_category_id,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert product form detail */
const insert_product_form_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product_form_detail = await product_form_collection.findOne(query, { name: 1 }, { runValidators: true });
            if (product_form_detail && product_form_detail._id) return reject({ status: PRESENT, response: product_form_detail.toJSON() });
            await product_form_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Sort insert product detail input data */
const sort_product_detail_insert_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { name, category_id, sub_category_id, seller_id, product_type_id, ...rest } = data;

        try {
            var dates = {
                created_at: new Date(),
                updated_at: new Date()
            }

            resolve({
                query: {
                    name: RegExp(name, "i"),
                    category: category_id,
                    sub_category: sub_category_id,
                    product_type: product_type_id
                },
                insert: {
                    name,
                    category: category_id,
                    sub_category: sub_category_id,
                    product_type: product_type_id,
                    ...rest,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Insert or Update product detail detail */
const insert_or_update_product_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product_detail = await product_detail_collection.findOne(query, { _id: 1 }, { runValidators: true });
            if (product_detail && product_detail._id) return reject({ status: PRESENT, response: product_detail.toJSON() });
            await product_detail_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

module.exports = {
    sort_product_category_input_data_controller,
    insert_or_update_product_category_detail_controller,

    sort_product_sub_category_input_data_controller,
    insert_or_update_product_sub_category_detail_controller,

    sort_product_size_insert_input_data_controller,
    insert_or_update_product_size_detail_controller,

    get_product_category_controller,
    get_product_sub_category_controller,
    get_product_size_controller,

    sort_product_form_insert_input_data_controller,
    insert_product_form_detail_controller,

    sort_product_detail_insert_input_data_controller,
    insert_or_update_product_detail_controller
}