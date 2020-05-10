require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Facilitate connection to database
 * @param {String} url mongodb connection url
 * @return {*} log to show success or failure of connection
 */
exports.connect = function (url) {
    mongoose.connect(url, { useNewUrlParser: true })
        .then(() => {
            console.log('database successfully connected');
        })
        .catch((err) => {
            console.error(`database connection failure: \n ${err.stack}`);
        });
};
