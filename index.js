const requestPromise = require('request-promise');
const crawler = require('./website-crawler');
const importToDataBase = require('./database');

(async () => {
    try {
        const API_URL = process.env.API_BASE_URL;
        const CACHE_SECRET = process.env.CACHE_SECRET;

        const uri = `${API_URL}/clear-cache/${CACHE_SECRET}`;

        // visit ncdc website, get latest PDF and extract data to JSON
        await crawler();

        // Import the data to DB
        await importToDataBase();

        // reset api cache
        await requestPromise({uri});

        // exist process
        process.exit();
    }catch (error) {
        console.log(error);
    }
})();
