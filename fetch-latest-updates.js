const { parse } = require('node-html-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const CDC_UPDATES_PATH = path.join(__dirname, 'cdcupdates');
const CDC_URL = 'https://www.cdc.gov/coronavirus/2019-nCoV/summary.html';

const date = new Date();

const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const shortDateString = `20-${month}-${day}`;

async function run() {
  const destination = path.join(CDC_UPDATES_PATH, `${shortDateString}.txt`);

  const result = await fetch(CDC_URL);
  const html = await result.text();
  const root = parse(html);
  const content = root.querySelector('.content');
  const cleanedContent = content.text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');

  fs.writeFileSync(destination, cleanedContent);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
