import React, { useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import ReactGA from 'react-ga';
import Dropdown from 'react-dropdown';
import queryString from 'query-string';
import './App.css';
import CDCUpdates from './cdcUpdatesMapping';

function convertShorthandToDate(shorthand) {
  const [year, month, day] = shorthand.split('-').map(val => parseInt(val, 10));
  return new Date('20' + year, month - 1, day).toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function App() {
  const query = queryString.parse(window.location.search);
  const dateOptions = Object.keys(CDCUpdates).reverse();
  const initialFromIndex =
    query.from != null && dateOptions.indexOf(query.from) >= 0
      ? dateOptions.indexOf(query.from)
      : 1;

  const initialToIndex =
    query.to != null && dateOptions.indexOf(query.to) >= 0
      ? dateOptions.indexOf(query.to)
      : 1;

  const [nextIndex, setNextIndex] = useState(initialToIndex);
  const [prevIndex, setPrevIndex] = useState(initialFromIndex);

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
      CDCUpdates[dateOptions[nextIndex]] ===
      CDCUpdates[dateOptions[prevIndexPointer]]
    ) {
      prevIndexPointer++;
    }
    setPrevIndex(prevIndexPointer);
  }, []);

  useEffect(() => {
    window.history.replaceState(
      {
        prevDate,
        nextDate,
      },
      '',
      '?' +
        queryString.stringify({
          from: prevDate,
          to: nextDate,
        }),
    );

    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [prevDate, nextDate]);

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
      {CDCUpdates[nextDate] === CDCUpdates[prevDate] ? (
        <NoUpdates prevDate={prevDate} nextDate={nextDate} />
      ) : (
        <ReactDiffViewer
          oldValue={CDCUpdates[prevDate]}
          newValue={CDCUpdates[nextDate]}
          splitView={true}
          compareMethod={DiffMethod.WORDS}
          hideLineNumbers={true}
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
