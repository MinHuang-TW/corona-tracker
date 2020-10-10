import React, { useState, useEffect } from 'react';
import { fetchCountries, fetchHistoryData } from './api';
import { Navbar, Total, History } from './components';
import styles from './App.module.css';
import MailOutlineSharpIcon from '@material-ui/icons/MailOutlineSharp';

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
        <div className={styles.footerContainer}>
          <p className={styles.api}>
            {`[ Data API ] `}
            <a href={link} target='_blank' rel='noopener noreferrer'>NOVELCovid</a>
          </p>
          <p className={styles.text}>Copyright © 2020 Min Huang</p>
          <a href='mailto:h.min719@gmail.com' className={styles.mail} aria-label='mail me'>
            <span className={styles.icon}>
              <MailOutlineSharpIcon fontSize='small' />
            </span>
          </a>
        </div>
      </footer>
    </>
  );
};

export default App;