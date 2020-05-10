const moment = require('moment');
const utils = require('../src/utils');

/**
 * @description Get all file withing the input path,
 * process it using the handler function and
 * save the output in JSON into the output path
 *
 * @param {String} inputPath path to files to be processed
 * @param {String} outputPath path to save the processed output
 * @param {Function} handler function to be for the doing the processing
 * @param {Boolean} writeToFle maybe to save to output path or not
 * @return {Promise<string>}
 */
async function fileProcessor(inputPath, outputPath, handler, writeToFle = true) {
    const files = utils.getFileNames(inputPath);

    const dataCollections = {};

    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        /**
         * The files names are always in this format 150420_16.pdf
         * So we're splitting by the underscore and the first item is the date
         */
        const {1: date} = filename.split('_');
        const formatDate = moment(date,"D-MMMM-YYYY").format("M/D/YYYY");
        console.log(formatDate);
        dataCollections[formatDate] = await handler(utils.getFile(`${inputPath}/${filename}`))
    }
    const output = JSON.stringify(dataCollections);
    if (writeToFle) utils.saveRecord(outputPath, output);
    console.log('Done processing');
    return output;
}
module.exports = fileProcessor;
