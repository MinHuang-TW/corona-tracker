import React from 'react';
import Countup from 'react-countup';
import BarChart from './BarChart';
import PieChart from './PieChart';
import { color } from './chartConfig';
import { getRatio } from '../../../utils/format';
import styles from './Chart.module.css';

const Chart = ({ data, bar }) => {
  const total = data?.cases;
  const dataLists = [
    { text: 'Confirmed', data: total },
    { text: 'Active', data: data?.active },
    { text: 'Recovered', data: data?.recovered },
    { text: 'Deaths', data: data?.deaths },
  ];
  return (
    <>
      <div className={bar ? styles.barChart : styles.chart}>
        {bar ? <BarChart data={data} /> : <PieChart data={data} />}
      </div>
      <div className={bar ? styles.breakdown_lists : styles.lists}>
        {dataLists.slice(!bar && 1).map(({ text, data }) => (
          <div key={text} className={styles.list}>
            <span
              className={styles.indicator}
              style={{ background: color[text.toLocaleLowerCase()] }}
            />
            <p>{text}</p>
            <div className={styles.ratio}>
              {bar ? (
                <Countup start={0} end={data} duration={0.5} separator=',' />
              ) : (
                <Countup start={0} end={getRatio(data, total)} duration={0.5} decimals={1} suffix='%' />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Chart;