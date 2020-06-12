import React, { useState, useEffect } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import CountrySelector from '../CountryPicker/CountrySelector';
import { Progress } from '../common';
import LineChart from '../Chart/LineChart';
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
    <div className={styles.container} style={{ height: '100vh', width: '85%' }}>
      <h1 style={{ margin: '32px auto' }}>Cases over time</h1>
      {countriesData.length ? (
        <>
          <CountrySelector
            countriesData={countriesData}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
          />
          <div style={{ margin: '40px auto', width: '100%' }}>
            <LineChart selectedCountries={selectedCountries} />
          </div>
        </>
      ) : (
        Progress
      )}
    </div>
  );
};

export default History;