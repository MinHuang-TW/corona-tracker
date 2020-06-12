import React, { useState, useEffect, useCallback } from 'react';
import { Cards, CountryPicker, Map, History } from './components';
import { fetchData, fetchCountries } from './api';
import styles from './App.module.css';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const lastUpdated = moment(data.updated).startOf('hour').fromNow();

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
        <History countries={countries} />
        {/* <Chart data={data} country={country} /> */}
      </div>

      <footer>
        <p>{`Updated ${lastUpdated}, `}</p>
        <p>{`Source: `} 
          <a 
            href='https://github.com/NovelCovid/API' 
            target='_blank' 
            rel='noopener noreferrer'
          >
            NOVELCovid API
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;