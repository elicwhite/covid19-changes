import React, { useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import ReactGA from 'react-ga';
import Dropdown from 'react-dropdown';
import queryString from 'query-string';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles } from './global';
import './App.css';
import CDCUpdatesSummary from './cdcUpdatesMappingSummary';
import CDCUpdatesScreening from './cdcUpdatesMappingScreening';
import CDCUpdatesManagement from './cdcUpdatesMappingManagement';
import pages from './pages';

function convertShorthandToDate(shorthand) {
  const [year, month, day] = shorthand.split('-').map(val => parseInt(val, 10));
  return new Date('20' + year, month - 1, day).toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function getPageMapping(page) {
  switch (page) {
    case 'summary':
      return CDCUpdatesSummary;
    case 'management':
      return CDCUpdatesManagement;
    case 'screening':
      return CDCUpdatesScreening;
    default:
      return CDCUpdatesSummary;
  }
}

function App() {
  const query = queryString.parse(window.location.search);

  const initialPage = query.page in pages ? query.page : 'summary';
  const [page, setPage] = useState(initialPage);
  const CDCUpdates = getPageMapping(page);

  const dateOptions = Object.keys(CDCUpdates).reverse();
  const initialFromIndex =
    query.from != null && dateOptions.indexOf(query.from) >= 0
      ? dateOptions.indexOf(query.from)
      : 1;

  const initialToIndex =
    query.to != null && dateOptions.indexOf(query.to) >= 0
      ? dateOptions.indexOf(query.to)
      : 0;

  const [nextIndex, setNextIndex] = useState(initialToIndex);
  const [prevIndex, setPrevIndex] = useState(initialFromIndex);

  const formattedOptions = dateOptions.map((dateOption, index) => ({
    value: index,
    label: convertShorthandToDate(dateOption),
  }));

  const pageOptions = Object.keys(pages).map(page => ({
    value: page,
    label: pages[page].dropDownLabel,
  }));

  const prevDate = dateOptions[prevIndex];
  const nextDate = dateOptions[nextIndex];

  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    if (theme === 'light'){
      setTheme('dark');
    }else{
      setTheme('light');
    }
  }

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
  }, [page]);

  useEffect(() => {
    window.history.replaceState(
      {
        prevDate,
        nextDate,
        page,
      },
      '',
      '?' +
        queryString.stringify({
          from: prevDate,
          to: nextDate,
          page: page,
        }),
    );

    if (!window.location.hostname.includes('localhost')) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, [prevDate, nextDate, page]);

  return (
    <div className="App">
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
      <h1>
        Comparison of <a href={pages[page].url}>{pages[page].title}</a>
      </h1>
      <div className="page-picker-row">
      <Toggle theme={theme} toggleTheme={toggleTheme} />
        <Dropdown
          options={pageOptions}
          onChange={newValue => {
            setPrevIndex(1);
            setNextIndex(0);
            setPage(newValue.value);
          }}
          value={page}
          placeholder="Select a page"
        />
      </div>
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
          useDarkTheme={theme === 'dark'}
        />
      )}
      </ThemeProvider>
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
