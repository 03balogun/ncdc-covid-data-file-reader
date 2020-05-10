const fileProcessor = require('./src/fileProcessor');
const config = require('./config');
// const format1Reader = require('./src/handlers/format1Reader');
// const format2Reader = require('./src/handlers/format2Reader');
// const format3Reader = require('./src/handlers/format3Reader');
// const format4Reader = require('./src/handlers/format4Reader');
// const format5Reader = require('./src/handlers/format5Reader');
const format6Reader = require('./src/handlers/format6Reader');

(async () => {
    const path = config.FILES_PATH.format6;

    const result = await fileProcessor(
        `${path}`,
        'format6Reader.json',
        format6Reader);
    // console.log(result);
})();
