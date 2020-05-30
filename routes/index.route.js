var express = require('express');
var userRouter = require('./user.route');
var router = express.Router();
var messageRouter = require('./message.route');
var adminRouter = require("./admin.route");
var contentWriterRouter = require("./content.writer.route");
var sailsRouter = require("./sails.route");
var commonRouter = require("./common.route");

router.use("/", commonRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/content_writer", contentWriterRouter);
router.use("/sails", sailsRouter);
router.use("/message", messageRouter);

module.exports = router;
