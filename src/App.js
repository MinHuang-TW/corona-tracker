import React, { useState, useEffect } from 'react';
import { fetchCountries, fetchHistoryData } from './api';
import { Total, History } from './components';
import styles from './App.module.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const link = 'https://github.com/NovelCovid/API';

  useEffect(() => {
    const getData = async () => {
      const countryNames = await fetchCountries();
      setCountries(countryNames);
      setCountriesData([
        ...await fetchHistoryData(), 
        ...await fetchHistoryData(countryNames),
      ]);
    };
    getData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Total countries={countries} />
        <History countriesData={countriesData} />
      </div>

      <footer>
        <p>
          {`Source: `}
          <a href={link} target='_blank' rel='noopener noreferrer'>
            NOVELCovid API
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;