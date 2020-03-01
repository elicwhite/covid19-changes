import React, { useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import Dropdown from 'react-dropdown';
import './App.css';
import raw from 'raw.macro';

const dates = {
  '20-01-21': raw('../cdcupdates/20-01-21.txt'),
  '20-01-22': raw('../cdcupdates/20-01-22.txt'),
  '20-01-23': raw('../cdcupdates/20-01-23.txt'),
  '20-01-24': raw('../cdcupdates/20-01-24.txt'),
  '20-01-25': raw('../cdcupdates/20-01-25.txt'),
  '20-01-26': raw('../cdcupdates/20-01-26.txt'),
  '20-01-27': raw('../cdcupdates/20-01-27.txt'),
  '20-01-28': raw('../cdcupdates/20-01-28.txt'),
  '20-01-29': raw('../cdcupdates/20-01-29.txt'),
  '20-01-30': raw('../cdcupdates/20-01-30.txt'),
  '20-01-31': raw('../cdcupdates/20-01-31.txt'),
  '20-02-01': raw('../cdcupdates/20-02-01.txt'),
  '20-02-02': raw('../cdcupdates/20-02-02.txt'),
  '20-02-03': raw('../cdcupdates/20-02-03.txt'),
  '20-02-04': raw('../cdcupdates/20-02-04.txt'),
  '20-02-05': raw('../cdcupdates/20-02-05.txt'),
  '20-02-06': raw('../cdcupdates/20-02-06.txt'),
  '20-02-07': raw('../cdcupdates/20-02-07.txt'),
  '20-02-08': raw('../cdcupdates/20-02-08.txt'),
  '20-02-09': raw('../cdcupdates/20-02-09.txt'),
  '20-02-10': raw('../cdcupdates/20-02-10.txt'),
  '20-02-11': raw('../cdcupdates/20-02-11.txt'),
  '20-02-12': raw('../cdcupdates/20-02-12.txt'),
  '20-02-13': raw('../cdcupdates/20-02-13.txt'),
  '20-02-14': raw('../cdcupdates/20-02-14.txt'),
  '20-02-15': raw('../cdcupdates/20-02-15.txt'),
  '20-02-16': raw('../cdcupdates/20-02-16.txt'),
  '20-02-17': raw('../cdcupdates/20-02-17.txt'),
  '20-02-18': raw('../cdcupdates/20-02-18.txt'),
  '20-02-19': raw('../cdcupdates/20-02-19.txt'),
  '20-02-20': raw('../cdcupdates/20-02-20.txt'),
  '20-02-21': raw('../cdcupdates/20-02-21.txt'),
  '20-02-22': raw('../cdcupdates/20-02-22.txt'),
  '20-02-23': raw('../cdcupdates/20-02-23.txt'),
  '20-02-24': raw('../cdcupdates/20-02-24.txt'),
};

function convertShorthandToDate(shorthand) {
  const [year, month, day] = shorthand.split('-').map(val => parseInt(val, 10));
  return new Date('20' + year, month - 1, day).toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function App() {
  const dateOptions = Object.keys(dates).reverse();
  const [nextIndex, setNextIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(1);

  const formattedOptions = dateOptions.map((dateOption, index) => ({
    value: index,
    label: convertShorthandToDate(dateOption),
  }));

  const prevDate = dateOptions[prevIndex];
  const nextDate = dateOptions[nextIndex];

  // On mount, find the most recent previous date that results in a diff
  useEffect(() => {
    let prevIndexPointer = prevIndex;

    while (
      dates[dateOptions[nextIndex]] == dates[dateOptions[prevIndexPointer]]
    ) {
      prevIndexPointer++;
    }

    setPrevIndex(prevIndexPointer);
  }, []);

  return (
    <div className="App">
      <h1>
        Comparison of{' '}
        <a href="https://www.cdc.gov/coronavirus/2019-nCoV/summary.html">
          CDC's COVID-19 updates
        </a>
      </h1>
      <div className="date-picker-row">
        <Dropdown
          options={formattedOptions}
          onChange={newValue => {
            setPrevIndex(newValue.value);
          }}
          value={convertShorthandToDate(prevDate)}
          placeholder="Select a date to compare from"
        />
        <Dropdown
          options={formattedOptions}
          onChange={newValue => {
            setNextIndex(newValue.value);
          }}
          value={convertShorthandToDate(nextDate)}
          placeholder="Select a date to compare to"
        />
      </div>
      {dates[nextDate] === dates[prevDate] ? (
        <NoUpdates prevDate={prevDate} nextDate={nextDate} />
      ) : (
        <ReactDiffViewer
          oldValue={dates[prevDate]}
          newValue={dates[nextDate]}
          splitView={true}
          compareMethod={DiffMethod.WORDS}
        />
      )}
    </div>
  );
}

function NoUpdates({ prevDate, nextDate }) {
  return (
    <div className="page-center">
      No changes found on CDC's website found between{' '}
      {convertShorthandToDate(prevDate)} and {convertShorthandToDate(nextDate)}
    </div>
  );
}

export default App;
