import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Map } from '../../components';
import { color } from '../common/Chart/chartConfig';
import { AnchoredTitle, CountryPicker, Cards, PieChart, Progress } from '../common';
import styles from './Total.module.css';

const Total = ({ countries, data, setData }) => {
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const global = country && country.name === 'Worldwide';

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
    <section id='total' className={styles.container}>
      <div style={{ zIndex: 1, position: 'relative' }}>
        <Map
          country={country}
          setCountry={setCountry}
          countries={countries}
          handleCountry={handleCountry}
          data={data}
          popupOpen={popupOpen}
          setPopupOpen={setPopupOpen}
        />
      </div>
      {countries.length ? (
        <div className={styles.body}>
          <AnchoredTitle hrefId='total' color='#fff' dark>
            Coronavirus Total Cases
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
          <Cards data={data} />

          <div className={styles.box}>
            <div className={styles.box_chart}>
              <PieChart data={data} />
            </div>

            <div className={styles.box_text}>
              <div className={styles.box_text_title}>
                {`${global ? 'Global cases' : country && country.name}`}
              </div>
              <div className={styles.box_text_data}>
                {dataLists.map(({ text, data, color }) => (
                  <div key={text} className={styles.box_text_list}>
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