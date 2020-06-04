import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Cards, Chart, CountryPicker } from './components';
import { fetchData } from './api';
import styles from './App.module.css';
import { Typography } from '@material-ui/core';

const App = () => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState('');

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
    };
    getData();
  }, []);

  const handleCountry = async (country) => {
    const getData = await fetchData(country);
    setCountry(country);
    setData(getData);
  };

  return (
    <>
      <div className={styles.container}>
        <header>
          <Typography variant='h3' color='textSecondary'>
            Coronavirus Tracker
          </Typography>
          {/* <span className={styles.icon} role='img' aria-label='corona icon'>
            🦠
          </span> */}
        </header>

        <CountryPicker handleCountry={handleCountry} />
        <Cards data={data} />
        <Chart data={data} country={country} />
      </div>
      
      <footer>
        <Typography color='textSecondary' variant='caption'>
          Updated <strong>
          {moment(data.lastUpdate).startOf('hour').fromNow()}
          </strong> from NOVELCovid API
        </Typography>
      </footer>
    </>
  );
};

export default App;