const fileProcessor = require('./src/fileProcessor');
const config = require('./config');
// const format1Reader = require('./src/handlers/format1Reader');
// const format2Reader = require('./src/handlers/format2Reader');
// const format3Reader = require('./src/handlers/format3Reader');
// const format4Reader = require('./src/handlers/format4Reader');
const format5Reader = require('./src/handlers/format5Reader');
// const format6Reader = require('./src/handlers/format5Reader');

(async () => {
    const path = config.FILES_PATH.format5;

    const result = await fileProcessor(
        `${path}`,
        'NCDC-covid-19-March 28 - April 5.json',
        format5Reader);
    console.log(result);
})();
