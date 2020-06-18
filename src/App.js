import React, { useState, useEffect } from 'react';
import { fetchData, fetchCountries, fetchHistoryData } from './api';
import { Total, History } from './components';
import styles from './App.module.css';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const lastUpdated = moment(data.updated).startOf('hour').fromNow();
  const link = 'https://github.com/NovelCovid/API';

  useEffect(() => {
    const getData = async () => {
      const countryNames = await fetchCountries();
      setData(await fetchData());
      setCountries(countryNames);
      setCountriesData([
        ...await fetchHistoryData(), 
        ...await fetchHistoryData(countryNames),
      ]);
    };
    getData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Total countries={countries} data={data} setData={setData} updated={lastUpdated} />
        <History countriesData={countriesData} updated={lastUpdated} />
      </div>

      <footer>
        <p>
          {`Source: `}
          <a href={link} target='_blank' rel='noopener noreferrer'>
            NOVELCovid API
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;