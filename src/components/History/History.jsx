import React, { useState, useEffect } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import CountryPicker from '../CountryPicker/CountryPicker';
import { Progress } from '../common';
import LineChart from '../Chart/LineChart';
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
    <section className={styles.container}>
      <h1 className={styles.title}>
        Cases over time
      </h1>
      {countriesData.length > 1 ? (
        <>
          <CountryPicker
            countries={countriesData}
            country={selectedCountries}
            setCountry={setSelectedCountries}
            radius={6}
            selector
          />
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