const { parse } = require('node-html-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const currentFolder = __dirname;
const CDC_UPDATES_PATH = path.join(__dirname, 'cdcupdates');

// prettier-ignore
const dates = {
  '20-02-11': 'http://web.archive.org/web/20200211035411/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html',
  '20-03-01': 'http://web.archive.org/web/20200301103002/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html'
}

async function run() {
  for (date in dates) {
    const destination = path.join(CDC_UPDATES_PATH, `${date}.txt`);
    if (fs.existsSync(destination)) {
      console.log('Already have', date, '... Skipping');
      continue;
    }

    const url = dates[date];
    const result = await fetch(url);
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
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
