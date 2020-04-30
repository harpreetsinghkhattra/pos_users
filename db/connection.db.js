var { MongoClient } = require("mongodb");
var db = undefined;
var client = undefined;

/** Mongodb connection */
const connection = function () {
    let uri = "mongodb://127.0.0.1";

    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, _client) => {
        if (err) throw new Error("mongodb unable to connect");
        if (_client) {
            db = _client.db('cookster');
            client = _client;
        }
    });
}

/** Get db */
const getDB = () => db;

/** Get client */
const getClient = () => client;

module.exports = {
    connection,
    getDB,
    getClient
}