var {
    COLLECTION_PRODUCT_CATEGORY,
    COLLECTION_PRODUCT_SIZE,
    COLLECTION_PRODUCT_SUB_CATEGORY,
    COLLECTION_PRODUCT_FORM,
    COLLECTION_PRODUCT,
    COLLECTION_SELLER_USER_DETAIL,
    COLLECTION_PRODUCT_SIZE_TYPE,
    COLLECTION_PRODUCT_TYPE,
    COLLECTION_USER_INFORMATION
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
    category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_CATEGORY, required: true },
    sub_category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SUB_CATEGORY, required: true },
    product_type: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SUB_CATEGORY, required: true },
    name: { type: Schema.Types.String, required: true },
    form_keys: [{
        id: { type: Schema.Types.String, required: true },
        name: { type: Schema.Types.String, required: true },
        type: { type: Schema.Types.String, enum: INPUT_TYPES },
        tag: { type: Schema.Types.String, enum: INPUT_TAGS },
        required: { type: Schema.Types.Boolean, required: true },
        form: [{
            id: { type: Schema.Types.String, required: true },
            name: { type: Schema.Types.String, required: true },
            type: { type: Schema.Types.String, enum: INPUT_TYPES, required: true },
            tag: { type: Schema.Types.String, enum: INPUT_TAGS, required: true },
            required: { type: Schema.Types.Boolean, required: true }
        }],
        is_multiple: { type: Schema.Types.Boolean, required: true }
    }],
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

// const Form = new Schema({
//     category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_CATEGORY, required: true },
//     sub_category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SUB_CATEGORY, required: true },
//     name: { type: Schema.Types.String, required: true },
//     form_keys: [{
//         id: { type: Schema.Types.String, required: true },
//         name: { type: Schema.Types.String, required: true },
//         type: { type: Schema.Types.String, enum: INPUT_TYPES },
//         tag: { type: Schema.Types.String, enum: INPUT_TAGS },
//         required: { type: Schema.Types.Boolean, required: true },
//         form: [{
//             id: { type: Schema.Types.String, required: true },
//             name: { type: Schema.Types.String, required: true },
//             type: { type: Schema.Types.String, enum: INPUT_TYPES, required: true },
//             tag: { type: Schema.Types.String, enum: INPUT_TAGS, required: true },
//             required: { type: Schema.Types.Boolean, required: true }
//         }],
//         is_multiple: { type: Schema.Types.Boolean, required: true }
//     }],
//     status: { type: Schema.Types.String, default: ACTIVE },
//     created_at: { type: Schema.Types.Date, required: true },
//     updated_at: { type: Schema.Types.Date, required: true }
// }, { versionKey: false });

const Product = new Schema({
    name: { type: Schema.Types.String, required: true },
    detail: { type: Schema.Types.String, required: true },
    inclusive_of_all_taxes: { type: Schema.Types.Boolean, required: true },
    product_code: { type: Schema.Types.String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_CATEGORY, required: true },
    sub_category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SUB_CATEGORY, required: true },
    seller: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    size: [{ type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SIZE }],
    product_type: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_TYPE, required: true },
    status: { type: Schema.Types.String, default: ACTIVE },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const ProductSize = new Schema({
    price: { type: Schema.Types.Number, required: true },
    size: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SIZE_TYPE, required: true },
    chest: { type: Schema.Types.Number },
    front_length: { type: Schema.Types.Number },
    across_sholder: { type: Schema.Types.Number },
    inseam_length: { type: Schema.Types.Number },
    waist: { type: Schema.Types.Number },
    outseam_length: { type: Schema.Types.Number },
    hip: { type: Schema.Types.Number },
    bust: { type: Schema.Types.Number },
    skirt_length: { type: Schema.Types.Number },
    choli_length: { type: Schema.Types.Number },
    lehenga_length: { type: Schema.Types.Number }
}, { versionKey: false });

const ProductType = new Schema({
    category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_CATEGORY, required: true },
    sub_category: { type: Schema.Types.ObjectId, ref: COLLECTION_PRODUCT_SUB_CATEGORY, required: true },
    name: { type: Schema.Types.String, required: true }
}, { versionKey: false });

mongoose.model(COLLECTION_PRODUCT_CATEGORY, Category);
mongoose.model(COLLECTION_PRODUCT_SUB_CATEGORY, SubCategory);
mongoose.model(COLLECTION_PRODUCT_SIZE, ProductSize);
mongoose.model(COLLECTION_PRODUCT_FORM, Form);
mongoose.model(COLLECTION_PRODUCT, Product);
mongoose.model(COLLECTION_PRODUCT_SIZE_TYPE, Size);
mongoose.model(COLLECTION_PRODUCT_TYPE, ProductType);