import React, { useState, useEffect } from 'react';
import { fetchCountries } from '../../api';
import { Grid, NativeSelect, Typography } from '@material-ui/core';
import styles from './CountryPicker.module.css';

const CountryPicker = ({ handleCountry }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      setCountries(await fetchCountries());
    };
    getCountries();
  }, [setCountries]);

  return (
    <Grid  
      container 
      spacing={3} 
      justify='center' 
      alignItems='center' 
      className={styles.container}
    >
      <Grid item>
        <Typography color='textSecondary'>Location</Typography>
      </Grid>

      <Grid item>
        <NativeSelect
          defaultValue=''
          onChange={e => handleCountry(e.target.value)}
        >
          <option value=''>Worldwide</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </NativeSelect>
      </Grid>
    </Grid>
  );
};

export default CountryPicker;
