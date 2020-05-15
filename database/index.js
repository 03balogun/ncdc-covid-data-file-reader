require('dotenv').config();
const connection = require('./connection');
const model = require('./model');

const utils = require('../src/utils');

const filesPath = '../data/new';

const files = utils.getFileNames(filesPath);
let record = {};
for (let i = 0; i < files.length; i++) {
    const file = require(`${filesPath}/${files[i]}`);
    record = {...record, ...file}
}

const insertRecords = async () => {
    try {
        console.time('executionTime');

        let records = [];
        // Get the record key which is usually the dates
        const dates = Object.keys(record);
        // go through all dates
        for (let i = 0; i < dates.length; i++) {
            const stateRecords = record[dates[i]];
            // Get the states for the record being iterated
            const states = Object.keys(stateRecords);
            // loop through all states
            const formattedRecord = states.map(state => {
                // Get the keys we need from the current state
                const {total_confirmed_cases, total_discharged, total_deaths} = stateRecords[state];
                // return the object
                return {
                    state,
                    total_confirmed_cases,
                    total_discharged,
                    total_deaths,
                    report_date: new Date(`${dates[i]} 12:00:00`)
                }
            });

            //Uncomment for ROLLBACK
            // await model.deleteMany({
            //     report_date: formattedRecord[0].report_date
            // });
            ///push data
            records.push(formattedRecord);
        }
        // Flatten and insert
        records = records.flat();
        await model.create(records);
        console.log(`Done importing ${records.length} records`);
        console.timeEnd('executionTime');
    }catch (e) {
        console.log(e)
    }
};

(async ()=>{
    // Connect to db
    await connection.connect(process.env.DATABASE_SERVER);

    await insertRecords();

})();
