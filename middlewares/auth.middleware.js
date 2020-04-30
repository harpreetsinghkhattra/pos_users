const { getAuthoriztionToken, httpResponse } = require('../controller/response.controller');
const { BAD_REQUEST, FORBIDDEN, REQUEST_DATA, AUTH_DATA } = require("../constants/common.constants");
const { get_sso_user_token } = require("../controller/user.controller");
const { ObjectId } = require('mongodb');

const validate_header = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        next(httpResponse(req, res, BAD_REQUEST, {
            message: "Authorization token is not found."
        }));
        return;
    }

    const app_token = getAuthoriztionToken();
    if (token === app_token) {
        next();
    } else next(httpResponse(req, res, FORBIDDEN, {
        message: "Authorization token is not matched.",
        token: app_token
    }));
}

const validate_credentials = async (req, res, next) => {
    try {
        const id = req.headers.id;
        const access_token = req.headers.access_token;

        if (!id || !access_token) {
            next(httpResponse(req, res, BAD_REQUEST, {
                message: "Please check your credentials."
            }));
            return;
        }

        const sso_user_detail = await get_sso_user_token({ uid: ObjectId(id), access_token });

        const { updated_at, expires_in } = sso_user_detail.response;
        const date = new Date(updated_at);
        date.setSeconds(expires_in, 0);
        if (date < new Date()) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "Please check your credentials."
            }));
            return;
        }

        req[AUTH_DATA] = sso_user_detail.response;

        next();
    } catch (error) {
        console.log('error ===> ', error);
        const status = error && typeof error.status === "string" && error.status || null;
        const response = error && error.response || null;

        if (status) {
            next(httpResponse(req, res, status, response));
            return;
        }

        next(error);
    }
}

module.exports = {
    validate_header,
    validate_credentials
}