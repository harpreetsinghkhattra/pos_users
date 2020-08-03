var {
    COLLECTION_SELECTED_SHOPS,
    COLLECTION_USER_INFORMATION
} = require("../constants/collection.constants");
var { ACTIVE } = require("../constants/common.constants");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Selected_Shops = new Schema({
    name: { type: Schema.Types.String, min: 1, max: 50, trim: true, unique: true, required: true },
    address: {
        location: {
            type: { type: Schema.Types.String, default: 'Point' },
            coordinates: [
                { type: Schema.Types.Number, min: -180, max: 180, required: true },
                { type: Schema.Types.Number, min: -90, max: 90, required: true }
            ]
        }
    },
    user: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true },
}, { versionKey: false });

mongoose.model(COLLECTION_SELECTED_SHOPS, Selected_Shops);