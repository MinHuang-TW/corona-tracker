import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { useWindowWidth } from '../Hook';
import { Map } from '../../components';
import { AnchoredTitle, Block, CountryPicker, Chart, Cards, Progress } from '../common';
import styles from './Total.module.css';
import moment from 'moment';

const Total = ({ countries }) => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const lastUpdated = moment(data && data.updated).startOf('hour').fromNow();
  const countryName = country && country.name;

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
            {`Coronavirus ${windowWidth > 600 ? '(COVID-19) ' : ''}Cases`}
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
            title='Overview'
            subtitle={countryName}
            source={`Updated ${lastUpdated}`}
          >
            <Cards data={data} />
          </Block>

          <Block
            id='breakdown'
            title='Breakdown of Confirmed cases'
            subtitle={countryName}
            classes={styles.breakdown}
            source={`Updated ${lastUpdated}`}
          >
            <Chart data={data} bar />
          </Block>

          <Block
            id='distribution'
            title='Distribution of Confirmed cases'
            subtitle={countryName}
            classes={styles.distribution}
            source={`Updated ${lastUpdated}`}
          >
            <Chart data={data} />
          </Block>
        </div>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default Total;