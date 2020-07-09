var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
const models = path.join(__dirname, '../models');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^.].*\.js$/))
    .forEach(async file => require(path.join(models, file)));
    
var db = undefined;
var client = undefined;

/** Mongodb connection */
const connection = function () {

    mongoose.connection
        .on('error', () => console.log("data ===> "))
        .on('disconnected', connection)
        .on('open', function () {
            console.log("Mongodb Connected.");
        });

    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
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