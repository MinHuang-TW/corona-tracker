import React, { useState, useEffect } from 'react';
import { fetchData, fetchCountries } from './api';
import { Cards, CountryPicker, Map, History } from './components';
import { Progress } from './components/common';
import BarChart from './components/Chart/BarChart';
import Backdrop from '@material-ui/core/Backdrop';
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

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  return (
    <>
      <div className={styles.container}>
        <section style={{ height: '100vh' }}>
          <Map
            country={country}
            setCountry={setCountry}
            countries={countries}
            handleCountry={handleCountry}
            data={data}
            popupOpen={popupOpen}
            setPopupOpen={setPopupOpen}
          />
          {pickerOpen ? <Backdrop open={pickerOpen} /> : null}
          {countries.length ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                top: 'calc(-25px - 88px)',
                width: '100%',
                height: 'calc(50vh + 88px)',
              }}
            >
              <h1 style={{ color: 'white', lineHeight: '88px' }}>
                Coronavirus Total Cases
              </h1>
              <CountryPicker
                country={country}
                setCountry={setCountry}
                countries={countries}
                handleCountry={handleCountry}
                pickerOpen={pickerOpen}
                setPickerOpen={setPickerOpen}
                setPopupOpen={setPopupOpen}
                radius={24}
              />
              <Cards data={data} />
              <div style={{ margin: '40px auto', width: '95%' }}>
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
