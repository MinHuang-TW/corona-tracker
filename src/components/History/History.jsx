import React, { useState, useEffect } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import { CountryPicker, Progress, LineChart, Anchor } from '../common';
import styles from './History.module.css';

const History = ({ countries }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const allCountries = await fetchHistoryData(countries);
      const overall = await fetchHistoryOverall();
      setSelectedCountries([overall]);
      setCountriesData([overall, ...allCountries]);
    };
    getData();
  }, [countries]);

  return (
    <section id='history' className={styles.container}>
      <a href='#history' className={styles.title}>
        <Anchor />
        <h1>Confirmed cases over time</h1>
      </a>
      {countriesData.length ? (
        <>
          <div className={styles.selector}>
            <CountryPicker
              countries={countriesData}
              country={selectedCountries}
              setCountry={setSelectedCountries}
              radius={6}
              selector
            />
          </div>
          <div className={styles.chart}>
            <LineChart selectedCountries={selectedCountries} />
          </div>
        </>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default History;