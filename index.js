const moment = require('moment');
const utils = require('./src/utils');
const config = require('./config');
const fileReader = require('./src/filereader');

/**
 * TODO
 * - Visit NCDC website to download the latest result(PDF)
 * - Run the new through our algorithm to extract it's data
 */

(async () => {
    const files = utils.getFileNames(config.FILES_PATH);

    const dataCollections = {};

    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        /**
         * The files names are always in this format 150420_16.pdf
         * So we're splitting by the underscore and the first item is the date
         */
        const [date] = filename.split('_');
        const formatDate = moment(date,"DMYY").format("M/D/YYYY");
        dataCollections[formatDate] = await fileReader(utils.getFile(`${config.FILES_PATH}/${filename}`))
    }
    console.log(JSON.stringify(dataCollections));
})();
