import React, { useState, useEffect, useCallback } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import { CountryPicker, Progress, LineChart, Anchor } from '../common';
import { color } from '../common/Chart/chartConfig';
import styles from './History.module.css';

const History = ({ countries }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [activeType, setActiveType] = useState('cases');
  const types = [
    { type: 'cases', color: color.confirmed }, 
    { type: 'recovered', color: color.recovered }, 
    { type: 'deaths', color: color.deaths }, 
  ];

  const capitalize = (str, lower = false) => 
    (lower ? str.toLowerCase() : str)
      .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

  const getTypeText = (type) => (type === 'cases' ? 'Confirmed' : type);

  const TypeButton = ({ type, color }) => {
    const selected = activeType === type;
    const handleSetType = useCallback(() => setActiveType(type), [type]);
    return (
      <div 
        onClick={handleSetType}
        className={styles.type_button}
        style={{
          background: selected && `${color}`,
          border: `1px solid ${color}`,
          color: selected ? 'white' : `${color}`,
        }}
      >
        {getTypeText(type).toUpperCase()}
      </div>
    )
  };

  useEffect(() => {
    const getData = async () => {
      const allCountries = await fetchHistoryData(countries);
      const overall = await fetchHistoryOverall();
      setSelectedCountries([overall]);
      setCountriesData([overall, ...allCountries]);
    };
    getData();
  }, [countries]);

  return (
    <section id='history' className={styles.container}>
      <a href='#history' className={styles.title}>
        <Anchor />
        <h1>{capitalize(getTypeText(activeType))} cases over time</h1>
      </a>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {types.map((type, index) => (<TypeButton key={index} {...type} />))}
      </div>

      {countriesData.length ? (
        <>
          <div className={styles.selector}>
            <CountryPicker
              countries={countriesData}
              country={selectedCountries}
              setCountry={setSelectedCountries}
              radius={6}
              selector
            />
          </div>
          <div className={styles.chart}>
            <LineChart selectedCountries={selectedCountries} type={activeType} />
          </div>
        </>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default History;