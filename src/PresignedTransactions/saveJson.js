const fs = require('fs').promises;

const  saveJson = async (filename, payload) =>
  fs.writeFile(filename, JSON.stringify(payload, null, 2), {
    encoding: 'utf8'
  });

module.exports = { saveJson };
