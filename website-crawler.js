const requestPromise = require('request-promise');
const request = require('request');
const path = require('path');
const fs = require('fs');
const $ = require('cheerio');
const moment = require('moment');
const fileProcessor = require('./src/fileProcessor');
const format6Reader = require('./src/handlers/format6Reader');


/**
 * @description Visit NCDC, download latest report and save it to json
 */

const download = (uri, dest) => {
   return new Promise((resolve, reject) => {
       const file = fs.createWriteStream(dest);

       const sendReq = request.get({uri});


       sendReq.on('response', (response) => {
           if (response.statusCode !== 200) {
               return reject('Response status was ' + response.statusCode);
           }

           sendReq.pipe(file);
       });


       // close() is async, call cb after close completes
       file.on('finish', () => {
           file.close();
           resolve();
       });

       // check for requestPromise error too
       sendReq.on('error', (err) => {
           fs.unlink(dest);
           return reject(err.message);
       });

       file.on('error', (err) => { // Handle errors
           fs.unlink(dest); // Delete the file async. (But we don't check the result)
           return reject(err.message);
       });
   })
};

async function crawlWebsite(uri) {
    try {
        const options = {uri};
        return await requestPromise(options);
    }catch (e) {
        console.log(e);
    }
}


const visitNCDC = async () => {
    const BASE_URL = process.env.NCDC_BASE_URL;
    const FILES_URI = process.env.NCDC_FILE_PATH;

    try {
        console.log('Visiting Website');
        // Visit website
        const domContent = await crawlWebsite(`${BASE_URL}/${FILES_URI}`);

        for (let i = 0; i <= 1; i++) {
            // Get the report table, then get the first row
            const firstRow = $(domContent).find('table.table-striped').find('tbody tr')[i];

            // Get the last two columns
            const {2:dateColumn, 3: linkColumn} = $(firstRow).children();

            const date = $(dateColumn).text();
            const downloadLink = `${BASE_URL}${$(linkColumn).find('a').attr('href')}`;

            const baseDest = `./latest/${date}`;

            // If the date exists as folder in the path, abort mission, else procees
            if (fs.existsSync(baseDest)) return;

            // Create directory
            fs.mkdirSync(baseDest, {recursive: true});

            const parseDate = moment(date, 'D MMMM YYYY').format('D-MMMM-YYYY');

            const pdfOutputPath = `${baseDest}/report_${parseDate}.pdf`;

            // Download the file
            console.log('Downloading File');
            await download(downloadLink, `${pdfOutputPath}`);

            // Run extraction
            console.log('Extracting Data');
            const folderPath = path.resolve(`latest/${date}/`);
            const outputFolder = path.resolve('data/new/');
            await fileProcessor(folderPath, `${outputFolder}/report_${parseDate}.json`, format6Reader);
            console.log(`Done Files at ${folderPath}`);
            // End
        }

    }catch (error) {
        console.log(error)
    }

};

module.exports = visitNCDC;
