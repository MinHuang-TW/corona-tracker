import React from 'react';
import Countup from 'react-countup';
import styles from './Cards.module.css';
import { color } from '../Chart/chartConfig';

const Cards = ({
  data: { cases, todayCases, recovered, todayRecovered, deaths, todayDeaths },
}) => {
  if (!cases) return null;
  const setBackgroundColor = (title) => { 
    const type = title.toLocaleLowerCase();
    return { background: color[type] };
  };

  const contents = [
    { title: 'Confirmed', value: cases, todayValue: todayCases }, 
    { title: 'Recovered', value: recovered, todayValue: todayRecovered }, 
    { title: 'Deaths', value: deaths, todayValue: todayDeaths }
  ];
  
  return (
    <div className={styles.container}>
      {contents.map(({ title, value, todayValue }) => (
        <div key={title} className={styles.card}>
          <div className={styles.indicator} style={setBackgroundColor(title)} />
          <p className={styles.title}>{title}</p>

          <div className={styles.value}>
            <Countup start={0} end={value} duration={1} separator=',' />
            {todayValue !== 0 && (
              <span className={styles.badge} style={setBackgroundColor(title)}>
                +{todayValue.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;