const fileReader = require('../filereader');

/**
 * /**
 * @description Format6 is classified as files form April 6 and up
 * @param dataBuffer The file to read.
 * @return {Promise<void>}
 */
module.exports = async (dataBuffer) => {
    try {
        return fileReader(dataBuffer, function (state, figures) {
            /**
             * For some reason we have an empty string at end of all figures,
             * remove the empty guy.
             */
            if (figures.length > 8) figures.pop();

            /**
             * The actual number of columns we have for figures in the pdf is 8
             * When the length is 9  even after removing empty, concat the last two digit,
             * which are in tens but separated
             */
            if (figures.length === 9) {
                const {7: valueOn7, 8: valueOn8} = figures;
                // remove item on index 8
                figures.pop();
                // concat items on 7 and 8 as last item
                figures[figures.length - 1] = `${valueOn7}${valueOn8}`;
            }

            figures = figures.map(num => {
                const n = parseInt(num);
                return (isNaN(n)) ? 0 : n;
            });

            const {
                0: total_confirmed_cases,
                2: total_discharged,
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
