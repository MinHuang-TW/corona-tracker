import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Map } from '../../components';
import { CountryPicker, Cards, BarChart, Progress } from '../common';
import styles from './Total.module.css';

const Total = ({ countries, data, setData }) => {
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  return (
    <section className={styles.container}>
      <Map
        country={country}
        setCountry={setCountry}
        countries={countries}
        handleCountry={handleCountry}
        data={data}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
      />
      {countries.length ? (
        <div className={styles.body}>
          <h1 className={styles.title}>Coronavirus Total Cases</h1>
          <div className={styles.picker}>
            <CountryPicker
              country={country}
              setCountry={setCountry}
              countries={countries}
              handleCountry={handleCountry}
              setPopupOpen={setPopupOpen}
              radius={24}
            />
          </div>
          <Cards data={data} />
          <div className={styles.chart}>
            <BarChart country={country} data={data} />
          </div>
        </div>
      ) : (
        <Progress />
      )}
    </section>
  )
}

export default Total;