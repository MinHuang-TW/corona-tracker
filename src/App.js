import React, { useState, useEffect, useCallback } from 'react';
import { Cards, Chart, CountryPicker, Map } from './components';
import { fetchData, fetchCountries } from './api';
import styles from './App.module.css';
import { Typography } from '@material-ui/core';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
      setCountries(await fetchCountries());
    };
    getData();
  }, []);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  const handleClose = useCallback(() => {
    if (pickerOpen) setPickerOpen(false);
  }, [pickerOpen])

  return (
    <>
      <div className={styles.container} onClick={handleClose}>
        {/* <header>
          <Typography variant='h3' color='textSecondary'>
            Coronavirus Tracker
          </Typography> */}
          {/* <span className={styles.icon} role='img' aria-label='corona icon'>
            🦠
          </span> */}
        {/* </header> */}
        <Map 
          country={country} 
          setCountry={setCountry}
          countries={countries} 
          handleCountry={handleCountry}
          data={data}
          popupOpen={popupOpen}
          setPopupOpen={setPopupOpen}
        />
        <CountryPicker 
          country={country}
          setCountry={setCountry}
          countries={countries}
          handleCountry={handleCountry} 
          pickerOpen={pickerOpen}
          setPickerOpen={setPickerOpen}
          setPopupOpen={setPopupOpen}
        />
        <Cards data={data} />
        <Chart data={data} country={country} />
      </div>

      <footer>
        <Typography color='textSecondary' variant='caption'>
          Updated <strong>
          {moment(data.updated).startOf('hour').fromNow()}
          </strong> from NOVELCovid API
        </Typography>
      </footer>
    </>
  );
};

export default App;