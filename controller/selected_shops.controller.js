const mongoose = require('mongoose');
const { COLLECTION_SELECTED_SHOPS } = require("../constants/collection.constants");
const { SUCCESS, PRESENT, ERROR, NOT_VALID, DEACTIVE, NO_VALUE } = require("../constants/common.constants");
var { validate } = require('../schema');
var uuid = require('uuid/v4');

const selected_shops_collection = mongoose.model(COLLECTION_SELECTED_SHOPS);

/** Sort insert selected shop input data */
const sort_selected_shop_input_data_controller = async (data) => {
    return new Promise((resolve, reject) => {
        const { name, coordinates, uid } = data;

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
                    address: {
                        location: {
                            coordinates: [coordinates.lng, coordinates.lat]
                        }
                    },
                    user: uid,
                    ...dates
                }
            })
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Update or Insert selected shops detail */
const insert_or_update_selected_shops_detail_controller = async (query, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await selected_shops_collection.updateOne(query, data, { upsert: true, runValidators: true });
            resolve({ status: SUCCESS, response: data });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}

/** Get selected shop */
const get_selected_shop_controller = async (query = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                reject({ status: NOT_VALID, response: {} });
                return;
            }
            const selected_shop_detail = await selected_shops_collection.findOne(query, { updated_at: 0 });

            if (selected_shop_detail && selected_shop_detail._id) {
                return resolve({ status: SUCCESS, response: selected_shop_detail.toJSON() });
            }

            resolve({ status: NO_VALUE, response: {} });
        } catch (error) {
            reject({ status: ERROR, response: error });
        }
    });
}


module.exports = {
    sort_selected_shop_input_data_controller,
    insert_or_update_selected_shops_detail_controller,

    get_selected_shop_controller
}