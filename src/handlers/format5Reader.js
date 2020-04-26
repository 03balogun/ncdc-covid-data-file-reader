const fileReader = require('../filereader');

/**
 * /**
 * @description Format5 is classified as files form March 28 to April 5
 * @param dataBuffer The file to read.
 * @return {Promise<void>}
 */
module.exports = async (dataBuffer) => {
    try {
        return fileReader(dataBuffer, function (state, figures) {
            // Remove the empty string at the end of the figures
            figures.pop();
            figures = figures.map(num => {
                const n = parseInt(num);
                return (isNaN(n)) ? 0 : n;
            });
            const {
                0: total_confirmed_cases,
                // 1: total_active_cases,
                2: total_discharged,
                3: total_deaths,
            } = figures;
            return {total_confirmed_cases, total_discharged, total_deaths,
                total_active_cases: total_confirmed_cases - (total_discharged + total_deaths)
            }
        });
    } catch (error) {
        console.log(error);
    }
};
