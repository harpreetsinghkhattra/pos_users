var { USER_TYPE_SUPER_ADMIN, USER_TYPE_MARKETING, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER, USER_TYPE_USER, LOGIN_TYPE_CUSTOM_USER, LOGIN_TYPE_FACEBOOK, LOGIN_TYPE_GOOGLE, DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB, ACTIVE, DEACTIVE, ACCOUNT_NOT_VERIFIED, ACCOUNT_VERIFIED } = require("../constants/common.constants");
var { COLLECTION_USER_INFORMATION, COLLECTION_USER_DETAIL, COLLECTION_DEVICE_TOKENS, COLLECTION_SSO_TOKENS, COLLECTION_ADMIN_USER_DETAIL, COLLECTION_CONTENT_WRITER_USER_DETAIL, COLLECTION_SAILS_USER_DETAIL } = require("../constants/collection.constants");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDetail = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    first_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    last_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    email: { type: Schema.Types.String, required: true, trim: true },
    mobile_number: { type: Schema.Types.String, trim: true, default: null },
    mobile_code: { type: Schema.Types.String, trim: true, default: "+91" },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true },
}, { versionKey: false });

const UserInformation = new Schema({
    user_type: { type: Schema.Types.String, enum: [USER_TYPE_SUPER_ADMIN, USER_TYPE_MARKETING, USER_TYPE_CONTENT_WRITER, USER_TYPE_SELLER, USER_TYPE_USER], required: true },
    login_type: { type: Schema.Types.String, enum: [LOGIN_TYPE_CUSTOM_USER, LOGIN_TYPE_FACEBOOK, LOGIN_TYPE_GOOGLE], required: true },
    password: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, default: null },
    provider_user_id: { type: Schema.Types.String, default: null },
    status: { type: Schema.Types.String, enum: [ACTIVE, DEACTIVE], required: true },
    forgot_password_access_token: { type: Schema.Types.String, default: null },
    account: { type: Schema.Types.String, enum: [ACCOUNT_VERIFIED, ACCOUNT_NOT_VERIFIED], required: true },
    delete_status: { type: Schema.Types.String, enum: [ACTIVE, DEACTIVE], required: true },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const DeviceTokens = new Schema({
    token: { type: Schema.Types.String, default: null },
    uid: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    device_type: { type: Schema.Types.String, enum: [DEVICE_TYPE_ANDROID, DEVICE_TYPE_IOS, DEVICE_TYPE_WEB], required: true },
    device_signature: { type: Schema.Types.String, required: true },
    status: { type: Schema.Types.String, enum: [ACTIVE, DEACTIVE], required: true },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const SSO_Tokens = new Schema({
    access_token: { type: Schema.Types.String, required: true },
    refresh_token: { type: Schema.Types.String, required: true },
    expires_in: { type: Schema.Types.Number, required: true },
    device_signature: { type: Schema.Types.String, required: true },
    uid: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    status: { type: Schema.Types.String, enum: [ACTIVE, DEACTIVE], required: true },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const AdminDetail = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    first_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    last_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    email: { type: Schema.Types.String, required: true, trim: true },
    mobile_number: { type: Schema.Types.String, trim: true, default: null },
    mobile_code: { type: Schema.Types.String, trim: true, default: "+91" },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const SailsUserDetail = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    first_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    last_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    email: { type: Schema.Types.String, required: true, trim: true },
    mobile_number: { type: Schema.Types.String, trim: true, default: null },
    mobile_code: { type: Schema.Types.String, trim: true, default: "+91" },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

const ContentWriterUserDetail = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    first_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    last_name: { type: Schema.Types.String, min: 3, max: 20, trim: true, default: null },
    email: { type: Schema.Types.String, required: true, trim: true },
    mobile_number: { type: Schema.Types.String, trim: true, default: null },
    mobile_code: { type: Schema.Types.String, trim: true, default: "+91" },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
}, { versionKey: false });

mongoose.model(COLLECTION_USER_DETAIL, UserDetail);
mongoose.model(COLLECTION_USER_INFORMATION, UserInformation);
mongoose.model(COLLECTION_DEVICE_TOKENS, DeviceTokens);
mongoose.model(COLLECTION_SSO_TOKENS, SSO_Tokens);
mongoose.model(COLLECTION_ADMIN_USER_DETAIL, AdminDetail);
mongoose.model(COLLECTION_CONTENT_WRITER_USER_DETAIL, ContentWriterUserDetail);
mongoose.model(COLLECTION_SAILS_USER_DETAIL, SailsUserDetail);