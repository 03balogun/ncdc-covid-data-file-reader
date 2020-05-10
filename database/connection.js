const mongoose = require('mongoose');

/**
 * Facilitate connection to database
 * @param {String} url mongodb connection url
 * @return {*} log to show success or failure of connection
 */
exports.connect = async function (url) {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('database successfully connected');
    }catch (error) {
        console.error(`database connection failure: \n ${error.stack}`);
    }
};
