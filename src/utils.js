const fs = require('fs');


/**
 * @getFileNames
 * @param {String} path
 * @return {string[]}
 */
const getFileNames = (path) => fs.readdirSync(path);

/**
 * @getFile
 * @param {String} file
 * @return {Buffer}
 */
const getFile = (file) => fs.readFileSync(file);

/**
 * @saveRecord save a file to file system
 * @param {String} path
 * @param {String} records
 * return {Promise<*>}
 */
const saveRecord = (path, records) => {
    fs.writeFile(path, records, 'utf8', console.error);
};

module.exports = {
    getFileNames,
    getFile,
    saveRecord
};
