import React, { useState, useEffect, useCallback } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import { CountryPicker, Progress, LineChart, Anchor } from '../common';
import styles from './History.module.css';

const History = ({ countries }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [activeType, setActiveType] = useState('cases');
  const types = [
    { type: 'cases', color: 'darkred' }, 
    { type: 'recovered', color: 'green' }, 
    { type: 'deaths', color: 'darkgray' }, 
  ];

  const capitalize = (str, lower = false) => 
    (lower ? str.toLowerCase() : str)
      .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

  const getTypeText = (type) => (
    type === 'cases' ? 'Confirmed' : capitalize(type)
  );

  const TypeButton = ({ type, color }) => {
    const handleSetType = useCallback(() => setActiveType(type), [type]);
    return (
      <div 
        style={{
          margin: '32px 4px',
          padding: '8px 16px',
          background: activeType === type && `${color}`,
          border: `1px solid ${color}`,
          color: activeType === type ? 'white' : `${color}`,
          borderRadius: 6,
          cursor: 'pointer',
        }}
        onClick={handleSetType}
      >
        {getTypeText(type)}
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
        <h1>{getTypeText(activeType)} cases over time</h1>
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