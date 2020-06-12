import React from 'react';
import { Progress } from '../common';
import { Card, CardContent } from '@material-ui/core';
import Countup from 'react-countup';
import cx from 'classnames';
import styles from './Cards.module.css';

const Cards = ({
  data: { cases, todayCases, recovered, todayRecovered, deaths, todayDeaths },
}) => {
  if (!cases) return Progress;

  const contents = [{
    title: 'Confirmed',
    style: styles.infected,
    styleToday: styles.infectedToday,
    value: cases,
    todayValue: todayCases,
    text: 'of active cases until',
  }, {
    title: 'Recovered',
    style: styles.recovered,
    styleToday: styles.recoveredToday,
    value: recovered,
    todayValue: todayRecovered,
    text: 'of recoveries until',
  }, {
    title: 'Deaths',
    style: styles.deaths,
    styleToday: styles.deathsToday,
    value: deaths,
    todayValue: todayDeaths,
    text: 'of deaths until',
  }];

  return (
    <div className={styles.container}>
      {contents.map(({ style, styleToday, title, value, todayValue }) => (
        <Card key={title} className={cx(styles.card, style)}>
          <CardContent>
            <p className={styles.card_title}>{title}</p>

            <div className={styles.card_text}>
              <p className={styles.card_value}>
                <Countup start={0} end={value} duration={1} separator=',' />
              </p>

              {todayValue !== 0 && (
                <div>
                  <span className={styleToday}>
                    + {todayValue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Cards;