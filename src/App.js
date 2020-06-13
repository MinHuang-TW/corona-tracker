import React, { useState, useEffect } from 'react';
import { fetchData, fetchCountries } from './api';
import { Cards, Map, History } from './components';
import { CountryPicker, BarChart, Progress } from './components/common';
import styles from './App.module.css';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const lastUpdated = moment(data.updated).startOf('hour').fromNow();

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
      setCountries(await fetchCountries());
    };
    getData();
  }, []);

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  return (
    <>
      <div className={styles.container}>
        <section style={{ minHeight: '100vh' }}>
          <Map
            country={country}
            setCountry={setCountry}
            countries={countries}
            handleCountry={handleCountry}
            data={data}
            popupOpen={popupOpen}
            setPopupOpen={setPopupOpen}
          />
          {countries.length ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                top: -80,
                width: '100%',
              }}
            >
              <h1 style={{ color: 'white', marginBottom: 25 }}>
                Coronavirus Total Cases
              </h1>
              <CountryPicker
                country={country}
                setCountry={setCountry}
                countries={countries}
                handleCountry={handleCountry}
                setPopupOpen={setPopupOpen}
                radius={24}
              />
              <Cards data={data} />
              <div style={{ margin: 'auto', width: '80%', marginTop: 40 }}>
                <BarChart country={country} data={data} />
              </div>
            </div>
          ) : (
            <Progress />
          )}
        </section>
        <History countries={countries} />
      </div>

      <footer>
        <p>{`Updated ${lastUpdated}, `}</p>
        <p>
          {`Source: `}
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