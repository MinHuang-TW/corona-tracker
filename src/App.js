import React, { useState, useEffect } from 'react';
import { fetchCountries, fetchHistoryData } from './api';
import { Navbar, Total, History } from './components';
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
      <Navbar />

      <main className={styles.container}>
        <Total countries={countries} />
        <History countriesData={countriesData} />
      </main>

      <footer>
        <div>
          <p>{`[ API ] `}
            <a href={link} target='_blank' rel='noopener noreferrer'>
              NOVELCovid
            </a>
          </p>
          <p>[ DATA ] Worldometers, Johns Hopkins University</p>
        </div>
        <p className={styles.text}>Copyright © 2020 Min Huang</p>
      </footer>
    </>
  );
};

export default App;