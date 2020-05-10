const pdf = require('pdf-parse');
const {VALID_KEYS} = require('../config');

const OPTIONS = {
    pagerender: (pageData) => {
        if (pageData.pageIndex !== 1) return "";
        let render_options = {
            //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
            normalizeWhitespace: false,
            //do not attempt to combine same line TextItem's. The default value is `false`.
            disableCombineTextItems: false
        };

        let lastY, contents = [];
        return pageData.getTextContent(render_options)
            .then((textContent) => {
                for (let item of textContent.items) {
                    const {str} = item;
                    if (str.trim()) {
                        (lastY === item.transform[5] || !lastY)
                            ? contents.push(str.replace(/[\n\t\r]/g, ""))
                            : contents.push(`|${str}`);
                    }
                    lastY = item.transform[5];
                }
                return contents;
            });
    }
};

/**
 * /**
 * @description This file reads the NCDC PDF file and formats it to JSON
 * @param dataBuffer The file to read.
 * @param {Function} formatter the function which handles the data formatting
 * @return {Promise<void>}
 */
module.exports = async (dataBuffer, formatter) => {
    try {
        const data = await pdf(dataBuffer, OPTIONS);
        const collections = data.text.split('|');
        const metrics = {};

        const stateNames = {
            fct: 'abuja',
            ibom: 'akwa ibom',
            akwa: 'akwa ibom',
        };

        for (let i = 0; i < collections.length; i++) {
            const individualItem = collections[i].split(',');
            // Check if the first item in this collection is a valid key e.g state, total
            const key = individualItem[0];
            // Get the state name
            let state = key.replace(/[^\w\s]/gi, '').toLowerCase();
            let figures = individualItem.splice(1, individualItem.length);

            if (state === 'akwa' && figures[0] === 'Ibom') {
                figures.shift();
            }

            if (stateNames[state]) state = stateNames[state];

            if (VALID_KEYS.includes(state)) {
                /**
                 * The formatter callback returns data in this format
                 * {total_confirmed_cases,total_discharged,total_deaths,total_active_cases}
                 *
                 * Loop through figures to get each column data we need
                 * Fields we are interested in:
                 * - TOTAL CONFIRMED CASES
                 * - TOTAL DISCHARGED CASES
                 * - TOTAL DEATHS
                 * - TOTAL ACTIVE(TCA - (TDC + TD))
                 */
                if (!metrics[state]) {
                    metrics[state] = formatter(state, figures);
                }
            }
        }
        return metrics;
    } catch (error) {
        console.log(error);
    }
};
