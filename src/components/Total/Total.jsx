import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Map } from '../../components';
import { color } from '../common/Chart/chartConfig';
import { AnchoredTitle, Block, CountryPicker, Cards, PieChart, Progress } from '../common';
import Countup from 'react-countup';
import styles from './Total.module.css';

const Total = ({ countries, data, setData, updated }) => {
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const countryName = country && country.name;

  const getRatio = (amount) => {
    if (amount === 0) return 0;
    const total = (data.cases + data.recovered + data.deaths);
    return parseFloat(amount / total * 100);
  };

  const dataLists = [
    { text: 'Confirmed', data: data.cases },
    { text: 'Recovered', data: data.recovered },
    { text: 'Deaths', data: data.deaths },
  ];

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  return (
    <section id='map'>
      <div style={{
        position: 'absolute',
        top: '40vh',
        width: '100vw', height: '10vh',
        zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))',
      }} />
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
          <AnchoredTitle hrefId='map'>Coronavirus Cases</AnchoredTitle>
          
          <CountryPicker
            country={country}
            setCountry={setCountry}
            countries={countries}
            handleCountry={handleCountry}
            setPopupOpen={setPopupOpen}
            radius={0}
          />

          <Block 
            id='total' 
            title='Total cases' 
            subtitle={countryName}
            source={`Updated ${updated}`}
          >
            <Cards data={data} />
          </Block>

          <Block 
            id='distribution' 
            title='Cases distribution' 
            subtitle={countryName}
            source={`Updated ${updated}`}
          >
            <div className={styles.box}>
              <div className={styles.chart}>
                <PieChart data={data} />
              </div>

              <div className={styles.lists}>
                {dataLists.map(({ text, data }) => (
                  <div key={text} className={styles.list}>
                    <span 
                      className={styles.indicator} 
                      style={{ background: color[text.toLocaleLowerCase()] }} 
                    />
                    <p>{text}</p>
                    <div className={styles.ratio}>
                      <Countup start={0} end={getRatio(data)} duration={0.3} decimals={1} suffix='%' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Block>
        </div>
      ) : (
        <Progress />
      )}
    </section>
  )
}

export default Total;