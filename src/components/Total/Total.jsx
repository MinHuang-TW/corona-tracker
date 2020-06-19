import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Map } from '../../components';
import { color } from '../common/Chart/chartConfig';
import { getRatio } from '../../utils/format';
import { AnchoredTitle, Block, CountryPicker, Cards, PieChart, Progress } from '../common';
import Countup from 'react-countup';
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
        style={{ background: `linear-gradient(
          to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))` 
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
            source={`Updated ${lastUpdated}`}
          >
            <Cards data={data} />
          </Block>

          <Block 
            id='distribution' 
            title='Case distribution' 
            subtitle={countryName}
            source={`Updated ${lastUpdated}`}
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
                      <Countup 
                        start={0} 
                        end={getRatio(data, cases)} 
                        duration={0.5} 
                        decimals={1} 
                        suffix='%' 
                      />
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