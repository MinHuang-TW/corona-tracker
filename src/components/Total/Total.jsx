import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Map } from '../../components';
import { color } from '../common/Chart/chartConfig';
import { AnchoredTitle, AnchoredSubTitle, CountryPicker, Cards, PieChart, Progress } from '../common';
import styles from './Total.module.css';

const Total = ({ countries, data, setData }) => {
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const getRatio = (amount) => {
    if (amount === 0) return '-';
    const total = (data.cases + data.recovered + data.deaths);
    return parseFloat((amount / total * 100).toFixed(1)) + '%';
  };

  const dataLists = [
    { text: 'Confirmed', data: data.cases, color: color.confirmed },
    { text: 'Recovered', data: data.recovered, color: color.recovered },
    { text: 'Deaths', data: data.deaths, color: color.deaths },
  ];

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  return (
    <section id='map' className={styles.container}>
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
          
          <div className={styles.picker}>
            <CountryPicker
              country={country}
              setCountry={setCountry}
              countries={countries}
              handleCountry={handleCountry}
              setPopupOpen={setPopupOpen}
              radius={24}
            />
          </div>
          <div id='total' className={styles.block}>
            <div style={{ margin: 24 }}>
              <AnchoredSubTitle 
                hrefId='total'
                title='Total cases'
                subTitle={country && country.name}
              />
            </div>
            <Cards data={data} />
          </div>

          <div id='distribution' className={styles.box}>
            <div style={{ width: '100%', marginBottom: 16 }}>
              <AnchoredSubTitle 
                hrefId='distribution'
                title='Cases distribution'
                subTitle={country && country.name}
              />
            </div>

            <div className={styles.chart}>
              <PieChart data={data} />
            </div>

            <div className={styles.content}>
              <div className={styles.lists}>
                {dataLists.map(({ text, data, color }) => (
                  <div key={text} className={styles.list}>
                    <span style={{ background: color }} />
                    <p>{text}</p>
                    <h2>{getRatio(data)}</h2>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <Progress />
      )}
    </section>
  )
}

export default Total;