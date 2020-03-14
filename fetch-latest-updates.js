const { parse } = require('node-html-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const CDC_UPDATES_PATH = path.join(__dirname, 'cdcupdates');

// CDC urls to scrape
const CDC_PAGES = {
  summary:
    'https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/summary.html',
  management:
    'https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html',
  screening:
    'https://www.cdc.gov/coronavirus/2019-nCoV/hcp/clinical-criteria.html',
};

const date = currentTimeInTimezone('America/New_York');
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const shortDateString = `20-${month}-${day}`;

async function run() {
  for (const [pageName, url] of Object.entries(CDC_PAGES)) {
    const destination = path.join(
      `${CDC_UPDATES_PATH}/${pageName}/${shortDateString}.txt`,
    );
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

function currentTimeInTimezone(timezone) {
  var date = new Date();

  var invdate = new Date(
    date.toLocaleString('en-US', {
      timeZone: timezone,
    }),
  );

  return invdate;
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
