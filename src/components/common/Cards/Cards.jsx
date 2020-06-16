import React from 'react';
import Countup from 'react-countup';
import cx from 'classnames';
import styles from './Cards.module.css';

const Cards = ({
  data: { cases, todayCases, recovered, todayRecovered, deaths, todayDeaths },
}) => {
  if (!cases) return null;

  const contents = [{
    title: 'Confirmed',
    style: styles.confirmed,
    value: cases,
    todayValue: todayCases,
  }, {
    title: 'Recovered',
    style: styles.recovered,
    value: recovered,
    todayValue: todayRecovered,
  }, {
    title: 'Deaths',
    style: styles.deaths,
    value: deaths,
    todayValue: todayDeaths,
  }];
  
  return (
    <div className={styles.container}>
      {contents.map(({ style, title, value, todayValue }) => (
        <div key={title} className={styles.card}>
          <div className={cx(styles.indicator, style)} />
          <p className={styles.title}>{title}</p>

          <div className={styles.text}>
            <p className={styles.value}>
              <Countup start={0} end={value} duration={1} separator=',' />
            </p>

            {todayValue !== 0 && (
              <span className={cx(style, styles.badge)}>
                + {todayValue.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;