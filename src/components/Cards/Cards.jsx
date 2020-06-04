import React from 'react';
import Countup from 'react-countup';
import cx from 'classnames';
import moment from 'moment';
import { CircularProgress, Card, CardContent, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styles from './Cards.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    margin: '100px auto',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const CardUnit = ({
  style,
  styleToday,
  title,
  value,
  todayValue,
  text,
  updated,
}) => (
  <Grid item component={Card} xs={12} md={3} className={cx(styles.card, style)}>
    <CardContent>
      <Typography color='textSecondary' gutterBottom>
        {title}
      </Typography>

      <Typography variant='h5' gutterBottom>
        <Countup start={0} end={value} duration={1} separator=',' />
        <Countup 
          className={styleToday} 
          start={0} end={todayValue} 
          duration={0.5} 
          separator=',' 
          prefix=' + ' 
        />
      </Typography>

      <Grid container alignItems='center'>
        <Grid item>
          <Typography variant='body2' color='textSecondary'>
            {text}
          </Typography>
        </Grid>

        <Grid item className={styles.date} xs={6} md={12}>
          <Typography variant='body2' color='textSecondary'>
            <strong>{moment(updated).format('MMMM D, YYYY')}</strong>
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Grid>
);

const Cards = ({
  data: {
    confirmed,
    todayCases,
    recovered,
    todayRecovered,
    deaths,
    todayDeaths,
    lastUpdate,
  },
}) => {
  const classes = useStyles();

  if (!confirmed) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  const contents = [
    {
      title: 'Confirmed',
      style: styles.infected,
      styleToday: styles.infectedToday,
      value: confirmed,
      todayValue: todayCases,
      text: 'of active cases until',
    },
    {
      title: 'Recovered',
      style: styles.recovered,
      styleToday: styles.recoveredToday,
      value: recovered,
      todayValue: todayRecovered,
      text: 'of recoveries until',
    },
    {
      title: 'Deaths',
      style: styles.deaths,
      styleToday: styles.deathsToday,
      value: deaths,
      todayValue: todayDeaths,
      text: 'of deaths until',
    },
  ];

  return (
    <div className={styles.container}>
      <Grid container spacing={3} justify='center'>
        {contents.map(
          ({ title, style, styleToday, value, todayValue, text }) => (
            <CardUnit
              key={title}
              title={title}
              value={value}
              todayValue={todayValue}
              text={text}
              style={style}
              styleToday={styleToday}
              updated={lastUpdate}
            />
          )
        )}
      </Grid>
    </div>
  );
};

export default Cards;
