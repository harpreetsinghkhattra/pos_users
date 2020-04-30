var express = require('express');
var userRouter = require('./user.route');
var router = express.Router();

router.use("/user", userRouter);

module.exports = router;
