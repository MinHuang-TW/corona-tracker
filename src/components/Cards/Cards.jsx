import React from 'react';
import Countup from 'react-countup';
import cx from 'classnames';
// import moment from 'moment';
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
  const classes = useStyles();

  if (!cases) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

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
        {contents.map(({ title, style, styleToday, value, todayValue, text }) => (
          <CardUnit
            key={title}
            title={title}
            value={value}
            todayValue={todayValue}
            text={text}
            style={style}
            styleToday={styleToday}
            updated={updated}
          />
        ))}
      </Grid>
    </div>
  );
};

export default Cards;
