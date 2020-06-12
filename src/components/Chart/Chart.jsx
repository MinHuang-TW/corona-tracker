import React from 'react';
import History from '../History/History';
// import LineChart from './LineChart';
// import BarChart from './BarChart';
import styles from './Chart.module.css';

const Chart = ({ data, country }) => {
  return (
    <div className={styles.container}>
      <History />
      {/* <BarChart data={data} /> */}
      {/* <LineChart country={country} /> */}
      {/* {country ? (
        <BarChart country={country} data={data} />
      ) : (
        <LineChart country={country} />
      )} */}
    </div>
  );
};

export default Chart;