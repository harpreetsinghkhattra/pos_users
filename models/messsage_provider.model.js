var { ACTIVE, DEACTIVE } = require('../constants/common.constants');
var { ACTIVE, DEACTIVE } = require("../constants/common.constants");
var { COLLECTION_USER_INFORMATION, COLLECTION_MESSAGE_PROVIDER_INFORMATION } = require("../constants/collection.constants");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageProvider = new Schema({
    created_by: { type: Schema.Types.ObjectId, ref: COLLECTION_USER_INFORMATION, required: true },
    host: { type: Schema.Types.String, required: true },
    port: { type: Schema.Types.Number, required: true },
    username: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
    total_emails: { type: Schema.Types.Number, required: true },
    account_created_date: { type: Schema.Types.Date, required: true },
    status: { type: Schema.Types.String, enum: [ACTIVE, DEACTIVE], required: true },
    deleted_status: { type: Schema.Types.String, enum: [ACTIVE, DEACTIVE], required: true },
    created_at: { type: Schema.Types.Date, required: true },
    updated_at: { type: Schema.Types.Date, required: true }
});

mongoose.model(COLLECTION_MESSAGE_PROVIDER_INFORMATION, MessageProvider);