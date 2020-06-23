import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Map } from '../../components';
import { AnchoredTitle, Block, CountryPicker, Chart, Cards, Progress } from '../common';
import styles from './Total.module.css';
import moment from 'moment';

const Total = ({ countries }) => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { cases, active, recovered, deaths, updated } = data && data;
  const lastUpdated = moment(updated).startOf('hour').fromNow();
  const countryName = country && country.name;

  const dataLists = [
    { text: 'Confirmed', data: cases },
    { text: 'Active', data: active },
    { text: 'Recovered', data: recovered },
    { text: 'Deaths', data: deaths },
  ];

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
    };
    getData();
  }, []);

  return (
    <section id='map'>
      <div
        className={styles.cover}
        style={{
          background: `linear-gradient(
          to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))`,
        }}
      />
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
        <div className={styles.body}>
          <AnchoredTitle hrefId='map'>
            Coronavirus Cases
          </AnchoredTitle>

          <CountryPicker
            country={country}
            setCountry={setCountry}
            countries={countries}
            handleCountry={handleCountry}
            setPopupOpen={setPopupOpen}
          />

          <Block
            id='overview'
            title='Cases overview'
            subtitle={countryName}
            source={`Updated ${lastUpdated}`}
          >
            <Cards data={data} />
          </Block>

          <Block
            id='breakdown'
            title='Breakdown'
            subtitle={countryName}
            classes={styles.breakdown}
            source={`Updated ${lastUpdated}`}
          >
            <Chart data={data} dataLists={dataLists} bar />
          </Block>

          <Block
            id='distribution'
            title='Distribution'
            subtitle={countryName}
            classes={styles.distribution}
            source={`Updated ${lastUpdated}`}
          >
            <Chart data={data} dataLists={dataLists.slice(1)} total={cases} />
          </Block>
        </div>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default Total;