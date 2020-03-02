const { parse } = require('node-html-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const CDC_UPDATES_PATH = path.join(__dirname, 'cdcupdates');

// prettier-ignore

// dates to backfill
const dates = {
  'summary': {
    '20-01-21': 'https://web.archive.org/web/20200121230721/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-22': 'https://web.archive.org/web/20200122074254/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-23': 'https://web.archive.org/web/20200123210102/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-24': 'https://web.archive.org/web/20200124213411/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-25': 'https://web.archive.org/web/20200125235002/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-26': 'https://web.archive.org/web/20200126210549/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-27': 'https://web.archive.org/web/20200127124834/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-28': 'https://web.archive.org/web/20200128220500/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-29': 'https://web.archive.org/web/20200129210515/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-30': 'https://web.archive.org/web/20200130235421/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-01-31': 'https://web.archive.org/web/20200131191845/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-01': 'https://web.archive.org/web/20200201222850/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-02': 'https://web.archive.org/web/20200202221311/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-03': 'https://web.archive.org/web/20200203145915/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-04': 'https://web.archive.org/web/20200204095343/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-05': 'https://web.archive.org/web/20200205233924/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-06': 'https://web.archive.org/web/20200206223631/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-07': 'https://web.archive.org/web/20200207213651/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-08': 'https://web.archive.org/web/20200208152846/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-09': 'https://web.archive.org/web/20200209224736/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-10': 'https://web.archive.org/web/20200210164201/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-11': 'https://web.archive.org/web/20200211173545/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-12': 'https://web.archive.org/web/20200212153047/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-13': 'https://web.archive.org/web/20200213164308/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-14': 'https://web.archive.org/web/20200214204733/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-15': 'https://web.archive.org/web/20200215213934/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-16': 'https://web.archive.org/web/20200216201049/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-17': 'https://web.archive.org/web/20200218032523/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-18': 'https://web.archive.org/web/20200219053517/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-19': 'https://web.archive.org/web/20200220182904/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-20': 'https://web.archive.org/web/20200221182709/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-21': 'https://web.archive.org/web/20200222215422/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-22': 'https://web.archive.org/web/20200223170732/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-23': 'https://web.archive.org/web/20200224213221/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-24': 'https://web.archive.org/web/20200225003215/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-25': 'https://web.archive.org/web/20200225233732/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-26': 'https://web.archive.org/web/20200226232704/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-27': 'https://web.archive.org/web/20200227193214/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
    '20-02-28': 'https://web.archive.org/web/20200228124634/https://www.cdc.gov/coronavirus/2019-nCoV/summary.html',
  },
  'screening': {
    '20-02-01': 'https://web.archive.org/web/20200201141832/https://www.cdc.gov/coronavirus/2019-nCoV/hcp/clinical-criteria.html',
    '20-02-11': 'https://web.archive.org/web/20200211025718/https://www.cdc.gov/coronavirus/2019-nCoV/hcp/clinical-criteria.html',
    '20-02-24': 'https://web.archive.org/web/20200224023243/https://www.cdc.gov/coronavirus/2019-nCoV/hcp/clinical-criteria.html',
    '20-02-29': 'https://web.archive.org/web/20200229045403/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-criteria.html',
    '20-03-01': 'https://web.archive.org/web/20200301102431/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-criteria.html'
  },
  'management': {
    '20-02-12': 'https://web.archive.org/web/20200211035411/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html',
    '20-02-26': 'https://web.archive.org/web/20200226145333/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html',
    '20-02-29': 'https://web.archive.org/web/20200226145333/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html',
    '20-03-01': 'https://web.archive.org/web/20200301103002/https://www.cdc.gov/coronavirus/2019-ncov/hcp/clinical-guidance-management-patients.html'
  },
}

async function run() {
  for (page in dates) {
    for (date in dates[page]) {
      const destination = path.join(CDC_UPDATES_PATH, `/${page}/${date}.txt`);
      if (fs.existsSync(destination)) {
        console.log('Already have', date, 'for', page, 'page ... Skipping');
        continue;
      }

      const url = dates[page][date];
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
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
