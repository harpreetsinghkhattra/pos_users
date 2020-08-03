var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
const models = path.join(__dirname, '../models');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^.].*\.js$/))
    .forEach(async file => require(path.join(models, file)));

var db = undefined;
var client = undefined;
var MAX_RECONNECT_COUNT = 3;
var RECONNECT_COUNT = 1;

/** Mongodb connection */
const connection = function () {
    if(RECONNECT_COUNT > MAX_RECONNECT_COUNT) {
        console.log("Mongodb Connection ===> RECONNECT LIMIT OVER", RECONNECT_COUNT);
        return;
    };

    try {
        mongoose.connection
            .on('error', () => {
                RECONNECT_COUNT += 1;
                console.log("Mongodb Connection ===> Listner Error")
                console.log("Mongodb Connection ===> RECONNECT COUNT", RECONNECT_COUNT);
            })
            .on('disconnected', connection)
            .on('open', function () {
                console.log("Mongodb Connected.");
            });

        return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    } catch (error) {
        console.log("Mongodb Connection ===> Error", error);
    }
}

/** Get db */
const getDB = () => db;

/** Get client */
const getClient = () => client;

let uri = "mongodb://3.15.230.14/alpha_pos";
// let uri = "mongodb://localhost:27017/alpha_pos";

module.exports = {
    connection,
    getDB,
    getClient
}