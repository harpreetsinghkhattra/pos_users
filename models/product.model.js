var {
    COLLECTION_PRODUCT_CATEGORY,
    COLLECTION_PRODUCT_SIZE,
    COLLECTION_PRODUCT_SUB_CATEGORY,
    COLLECTION_PRODUCT_FORM
} = require("../constants/collection.constants");
var {
    ACTIVE,
    INPUT_TAGS,
    INPUT_TYPES
} = require("../constants/common.constants");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: Schema.Types.String, min: 1, max: 20, trim: true, unique: true, required: true },
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true },
}, { versionKey: false });

const SubCategory = new Schema({
    category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_CATEGORY, required: true },
    name: { type: Schema.Types.String, min: 1, max: 20, trim: true, required: true, unique: true },
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true },
}, { versionKey: false });

const Size = new Schema({
    category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_CATEGORY, required: true },
    sub_category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SUB_CATEGORY, required: true },
    value: { type: Schema.Types.String, min: 1, max: 20, trim: true, required: true, unique: true },
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const Form = new Schema({
    name: { type: Schema.Types.String, required: true },
    form_keys: [{
        id: { type: Schema.Types.String, required: true },
        name: { type: Schema.Types.String, required: true },
        type: { type: Schema.Types.String, enum: INPUT_TYPES, required: true },
        tag: { type: Schema.Types.String, enum: INPUT_TAGS, required: true },
        required: { type: Schema.Types.Boolean, required: true }
    }],
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

mongoose.model(COLLECTION_PRODUCT_CATEGORY, Category);
mongoose.model(COLLECTION_PRODUCT_SUB_CATEGORY, SubCategory);
mongoose.model(COLLECTION_PRODUCT_SIZE, Size);
mongoose.model(COLLECTION_PRODUCT_FORM, Form);