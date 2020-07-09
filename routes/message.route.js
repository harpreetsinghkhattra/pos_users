var express = require('express');
var router = express.Router();
var { USER_TYPE_SUPER_ADMIN } = require("../constants/common.constants")

var {
    message_provider_validation,
    message_provider_sort_input_data,
    message_provider_insert_document,

    list_message_provider_middleware,
    list_message_provider_validation_middleware,

    get_message_provider_validation_middleware,
    get_message_provider_middleware } = require("../middlewares/message.middleware");
var { validate_credentials } = require('../middlewares/auth.middleware');
const nodemailer = require("nodemailer");

router.post("/provider",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    message_provider_validation,
    message_provider_sort_input_data,
    message_provider_insert_document);
router.get("/provider",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    list_message_provider_validation_middleware,
    list_message_provider_middleware);
router.get("/provider/:id",
    (req, res, next) => validate_credentials(req, res, next, [USER_TYPE_SUPER_ADMIN]),
    get_message_provider_validation_middleware,
    get_message_provider_middleware);
router.post("/send",
    async (req, res, next) => {
        try {
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp-relay.sendinblue.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    // user: "pos1592735249063@outlook.com", // generated ethereal user
                    // pass: "xsmtpsib-9f94e017532f19f4317e2b72105bcc50f5e73b08db6ce0d20cc0c4de0ae259f1-F9XHzSE7MfcRUwq3", // generated ethereal password
                    // user: "posprovidertssharma@outlook.com", // generated ethereal user
                    // pass: "ALcCx4pF7yDVaZjQ", // generated ethereal password
                    // user: "posproviderabsharma@outlook.com", // generated ethereal user
                    // pass: "BT3asgGnXb89CtHE", // generated ethereal password
                },
            });
            // xsmtpsib-9f94e017532f19f4317e2b72105bcc50f5e73b08db6ce0d20cc0c4de0ae259f1-F9XHzSE7MfcRUwq3

            // send mail with defined transport object
            // let info = await transporter.sendMail({
            //     from: 'posprovidertssharma@outlook.com', // sender address
            //     to: "posprovidertssharma@outlook.com", // list of receivers
            //     subject: "Hello ✔", // Subject line
            //     text: "Hello world?", // plain text body
            //     html: "<b>Hello world?</b>", // html body
            // });
            let info = await transporter.sendMail({
                from: 'pos1592733811749@outlook.com', // sender address
                to: "posprovidertpsharma@mailinator.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            res.status(200).json({ message: "mail sent", info: info })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: "got error", error: error })
        }
    });

module.exports = router;
