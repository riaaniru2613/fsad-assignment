const fs = require('fs');
const path = require('path');

const dbPath = (file) => path.join(__dirname, file);

const readDB = (file) => {
  const data = fs.readFileSync(dbPath(file), 'utf-8');
  return JSON.parse(data);
};

const writeDB = (file, data) => {
  fs.writeFileSync(dbPath(file), JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };
