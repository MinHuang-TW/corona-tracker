import React, { useState, useEffect } from 'react';
import { fetchData, fetchCountries } from './api';
import { Total, History } from './components';
import styles from './App.module.css';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);

  const lastUpdated = moment(data.updated).startOf('hour').fromNow();
  const link = 'https://github.com/NovelCovid/API';

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
      setCountries(await fetchCountries());
    };
    getData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Total countries={countries} data={data} setData={setData} />
        <History countries={countries} />
      </div>

      <footer>
        <p>{`Updated ${lastUpdated}, `}</p>
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