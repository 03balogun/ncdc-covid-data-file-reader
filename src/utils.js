const fs = require('fs');

module.exports = {
    getFileNames: (path) => fs.readdirSync(path),
    getFile: (file) => fs.readFileSync(file)
};
