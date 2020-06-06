import React, { useState, useEffect, useCallback } from 'react';
import { Cards, Chart, CountryPicker, Map } from './components';
import { fetchData, fetchCountries } from './api';
import styles from './App.module.css';
import { Typography } from '@material-ui/core';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [icon, setIcon] = useState(null);
  const [open, setOpen] = useState(false);

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
    if (open) setOpen(false);
  }, [open])

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
          selected_Country={country} 
          setCountry={setCountry}
          handleCountry={handleCountry}
          countries={countries} 
          setIcon={setIcon}
        />

        <CountryPicker 
          selected_Country={country}
          setCountry={setCountry}
          handleCountry={handleCountry} 
          countries={[{ name: 'Worldwide' }, ...countries]}
          icon={icon}
          setIcon={setIcon}
          open={open}
          setOpen={setOpen}
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