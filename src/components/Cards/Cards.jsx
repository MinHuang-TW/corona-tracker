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

const Cards = ({ data: { confirmed, recovered, deaths, lastUpdate } }) => {
  const classes = useStyles();
  
  if (!confirmed) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  };

  const CardUnit = ({ style, title, value, text }) => (
    <Grid item component={Card} xs={12} md={3} className={cx(styles.card, style)}>
      <CardContent>
        <Typography color='textSecondary' gutterBottom>
          {title}
        </Typography>
        <Typography variant='h5' gutterBottom>
          <Countup start={0} end={value} duration={1} separator=',' />
        </Typography>

        <Grid container alignItems='center'>
          <Grid item>
            <Typography variant='body2'>{text}</Typography>
          </Grid>

          <Grid item className={styles.date}>
            <Typography color='textSecondary'>
              {moment(lastUpdate).format('MMMM D, YYYY')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Grid>
  );

  const cardLists = [
    {
      title: 'Infected',
      style: styles.infected,
      value: confirmed.value,
      text: 'of active cases until',
    },
    {
      title: 'Recovered',
      style: styles.recovered,
      value: recovered.value,
      text: 'of recoveries until',
    },
    {
      title: 'Deaths',
      style: styles.deaths,
      value: deaths.value,
      text: 'of deaths until',
    },
  ];

  return (
    <div className={styles.container}>
      <Grid container spacing={3} justify='center'>
        {cardLists.map(({ title, style, value, text }) => (
          <CardUnit
            key={title}
            title={title}
            value={value}
            text={text}
            style={style}
          />
        ))}
      </Grid>
    </div>
  );
};

export default Cards;
