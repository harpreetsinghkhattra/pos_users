const { getAuthoriztionToken, httpResponse } = require('../controller/response.controller');
const { BAD_REQUEST, FORBIDDEN, REQUEST_DATA, AUTH_DATA, USER_TYPE_SUPER_ADMIN, USER_TYPE_MARKETING, USER_TYPE_CONTENT_WRITER } = require("../constants/common.constants");
const { get_sso_user_token, get_user_information } = require("../controller/user.controller");

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

const validate_credentials = async (req, res, next, user_types) => {
    try {
        const id = req.headers.id;
        const access_token = req.headers.access_token;

        if (!id || (id && id.length !== 24) || !access_token) {
            next(httpResponse(req, res, BAD_REQUEST, {
                message: "Please check your credentials."
            }));
            return;
        }
        
        const sso_user_detail = await get_sso_user_token({ uid: id, access_token });
        const { status, response } = await get_user_information({ _id: id });

        const { updated_at, expires_in } = sso_user_detail.response;
        const date = new Date(updated_at);
        date.setSeconds(expires_in, 0);
        if (date < new Date()) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "Please check your credentials."
            }));
            return;
        }

        const { user_type, account } = response;

        const check__user_type_index = user_types.indexOf(user_type);

        if (check__user_type_index === -1) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "User not has access for this API."
            }));
            return;
        }

        req[AUTH_DATA] = {
            user_type,
            account,
            ...sso_user_detail.response,
        };

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

const validate_refresh_token_credentials = async (req, res, next, user_types) => {
    try {
        const id = req.headers.id;
        const refresh_token = req.headers.refresh_token;

        if (!id || (id && id.length !== 24) || !refresh_token) {
            next(httpResponse(req, res, BAD_REQUEST, {
                message: "Please check your credentials."
            }));
            return;
        }

        const sso_user_detail = await get_sso_user_token({ uid: id, refresh_token });
        const { status, response } = await get_user_information({ _id: id });

        const { user_type, account } = response;

        const check__user_type_index = user_types.indexOf(user_type);
        if (check__user_type_index === -1) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "User do not has access for this API."
            }));
            return;
        }

        req[AUTH_DATA] = {
            user_type,
            account,
            ...sso_user_detail.response,
        };

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

const admin_validate_credentials = async (req, res, next) => {
    try {
        const id = req.headers.id;
        const access_token = req.headers.access_token;

        if (!id || (id && id.length !== 24) || !access_token) {
            next(httpResponse(req, res, BAD_REQUEST, {
                message: "Please check your credentials."
            }));
            return;
        }

        const sso_user_detail = await get_sso_user_token({ uid: id, access_token });
        const sso_user_information = await get_user_information({ _id: id });

        if (sso_user_information.user_type === USER_TYPE_SUPER_ADMIN) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "User is not admin."
            }));
            return;
        }

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

const content_writer_validate_credentials = async (req, res, next) => {
    try {
        const id = req.headers.id;
        const access_token = req.headers.access_token;

        if (!id || (id && id.length !== 24) || !access_token) {
            next(httpResponse(req, res, BAD_REQUEST, {
                message: "Please check your credentials."
            }));
            return;
        }

        const sso_user_detail = await get_sso_user_token({ uid: id, access_token });
        const sso_user_information = await get_user_information({ _id: id });

        if (sso_user_information.user_type === USER_TYPE_CONTENT_WRITER) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "User is not content writer."
            }));
            return;
        }

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

const sails_validate_credentials = async (req, res, next) => {
    try {
        const id = req.headers.id;
        const access_token = req.headers.access_token;

        if (!id || (id && id.length !== 24) || !access_token) {
            next(httpResponse(req, res, BAD_REQUEST, {
                message: "Please check your credentials."
            }));
            return;
        }

        const sso_user_detail = await get_sso_user_token({ uid: id, access_token });
        const sso_user_information = await get_user_information({ _id: id });

        if (sso_user_information.user_type === USER_TYPE_CONTENT_WRITER) {
            next(httpResponse(req, res, FORBIDDEN, {
                message: "User is not from sails."
            }));
            return;
        }

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
    validate_credentials,
    admin_validate_credentials,
    content_writer_validate_credentials,
    sails_validate_credentials,
    validate_refresh_token_credentials
}