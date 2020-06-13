import React, { useState, useEffect } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import CountryPicker from '../CountryPicker/CountryPicker';
import { Progress } from '../common';
import LineChart from '../Chart/LineChart';
import Backdrop from '@material-ui/core/Backdrop';
import styles from './History.module.css';

const History = ({ countries }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);

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
      {pickerOpen ? <Backdrop open={pickerOpen} /> : null}
      <h1 className={styles.title}>
        Cases over time
      </h1>
      {countries.length > 1 ? (
        <>
          <CountryPicker
            countries={countriesData}
            country={selectedCountries}
            setCountry={setSelectedCountries}
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
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