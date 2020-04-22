const pdf = require('pdf-parse');
const {VALID_KEYS} = require('../config');

const pagerender = (pageData) => {
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
};

const OPTIONS = {
    pagerender,
};

module.exports = async (dataBuffer) => {
    try {
        const data = await pdf(dataBuffer, OPTIONS);
        const collections = data.text.split('|');
        const metrics = {};

        for (let i = 0; i < collections.length; i++) {

            const individualItem = collections[i].split(',');

            // Check if the first item in this collection is a valid key e.g state, total
            const KEY = individualItem[0];
            if (VALID_KEYS.includes(KEY)) {
                let figures = individualItem.splice(1, individualItem.length);

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
                    figures.pop(); // remove item on index 8
                    figures[figures.length - 1] = `${valueOn7}${valueOn8}`
                }

                // Based on observation some the value of total active cases are falling out of place
                if (KEY === 'TOTAL' && figures.length > 7) {
                    const {6: valueOn6, 7: valueOn7} = figures;
                    figures.pop();
                    figures[figures.length - 1] = `${valueOn6}${valueOn7}`.trim();
                }

                metrics[KEY] = figures
            }
        }
        return metrics;
    } catch (error) {
        console.log(error);
    }
};
