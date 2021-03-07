const { parse } = require('node-html-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const CDC_UPDATES_PATH = path.join(__dirname, 'cdcupdates');

// CDC urls to scrape
const CDC_PAGES = {
  summary:
    'https://www.cdc.gov/coronavirus/2019-ncov/covid-data/covidview/index.html',
  management:
    'https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html',
  screening:
    'https://www.cdc.gov/coronavirus/2019-ncov/hcp/testing-overview.html',
};

const date = currentTimeInTimezone('America/New_York');
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const year = String(date.getFullYear()).substr(-2);
const shortDateString = `${year}-${month}-${day}`;

async function run() {
  for (const [pageName, url] of Object.entries(CDC_PAGES)) {
    const destination = path.join(
      `${CDC_UPDATES_PATH}/${pageName}/${shortDateString}.txt`,
    );
    const result = await fetch(url);
    let html;
    try {
      html = await result.text();
    } catch(err) {
      console.error(`Unable to fetch page at ${url}`);
      throw err;
    }

    const root = parse(html);
    const content = root.querySelector('.content');

    if (content == null) {
      throw new Error(`Unable to find .content element on ${url}`);
    }

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
