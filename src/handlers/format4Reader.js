const fileReader = require('../filereader');

/**
 * @description Format4 is classified as files form March 21 to March 26
 * @param dataBuffer The file to read.
 * @return {Promise<void>}
 */
module.exports = async (dataBuffer) => {
    try {
        return fileReader(dataBuffer, function (state, figures) {
            figures.pop();
            figures = figures.map(num => {
                const n = parseInt(num);
                return (isNaN(n)) ? 0 : n;
            });
            const {
                1: total_confirmed_cases,
                3: total_discharged,
                4: total_deaths,
            } = figures;
            return {
                total_confirmed_cases,
                total_discharged,
                total_deaths,
                total_active_cases: total_confirmed_cases - (total_discharged + total_deaths)
            }
        });
    } catch (error) {
        console.log(error);
    }
};
