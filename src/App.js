import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Cards, Chart, CountryPicker, Map } from './components';
import { fetchData, fetchCountries } from './api';
import styles from './App.module.css';
import { Typography } from '@material-ui/core';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
      setCountries(await fetchCountries());
    };
    getData();
  }, []);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
    setCountry(country);
  };

  return (
    <>
      <div className={styles.container}>
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
          handleCountry={handleCountry}
          countries={countries} 
          data={data} 
        />

        <CountryPicker 
          selected_Country={country}
          countries={[{ name: 'Worldwide' }, ...countries]}
          handleCountry={handleCountry} 
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