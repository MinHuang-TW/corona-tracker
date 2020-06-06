import React from 'react';
import Countup from 'react-countup';
import cx from 'classnames';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import styles from './Cards.module.css';

const CardUnit = ({ style, styleToday, title, value, todayValue }) => (
  <Grid item component={Card} xs={12} md={3} className={cx(styles.card, style)}>
    <CardContent>
      <Typography color='textSecondary' gutterBottom>
        {title}
      </Typography>

      <Typography variant='h5' gutterBottom>
        <Countup start={0} end={value} duration={1} separator=',' />
      </Typography>

      <Countup 
        className={styleToday} 
        start={0} end={todayValue} 
        duration={0.5} 
        separator=',' 
        prefix=' + ' 
      />
      <Typography variant='body2' color='textSecondary' display='inline'>
        than Yesterday
      </Typography>
    </CardContent>
  </Grid>
);

const Cards = ({
  data: {
    cases,
    todayCases,
    recovered,
    todayRecovered,
    deaths,
    todayDeaths,
    updated,
  },
}) => {
  if (!cases) return (
    <div className={styles.lds}>
      <div /><div /><div /><div />
    </div>
  );

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
      <Grid container spacing={3} justify='center'>
        {contents.map(content => (<CardUnit key={content.title} {...content} />))}
      </Grid>
    </div>
  );
};

export default Cards;