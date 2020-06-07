import React, { useState, useEffect } from 'react';
import { fetchData, fetchGlobalData } from '../../api';
import { Line, Bar } from 'react-chartjs-2';
import moment from 'moment';
import styles from './Chart.module.css';

const Chart = ({ data: { cases, recovered, deaths }, country }) => {
  moment.suppressDeprecationWarnings = true;
  const [globalData, setGlobalData] = useState([]);
  const [data, setData] = useState([]);

  const color = {
    confirmed: 'rgba(139, 0, 0)', 
    recovered: 'rgba(73,192,182)', 
    deaths: 'rgba(34, 34, 34)',
  };

  const bg = {
    confirmed: 'rgba(139, 0, 0, 0.2)', 
    recovered: 'rgba(73,192,182, 0.2)', 
    deaths: 'rgba(34, 34, 34, 0.2)',
  };

  const tooltips_style = {
    titleFontSize: 16,
    titleMarginBottom: 8,
    xPadding: 16,
    yPadding: 16,
  };

  useEffect(() => {
    const getData = async () => {
      setGlobalData(await fetchGlobalData());
      setData(await fetchData());
    };
    getData();
  }, []);

  const lineChart = globalData['cases'] ? (
    <Line
      data={{
        labels: Object
          .keys(globalData.cases)
          .map(date => moment(new Date(date)).format('MMMM D, YYYY')),
        datasets: [{ 
          data: Object.values(globalData.cases),
          label: ' Confirmed',
          borderColor: color.confirmed,
          backgroundColor: 'rgba(139, 0, 0, 0.1)',
          fill: true,
        }, { 
          data: Object.values(globalData.recovered),
          label: ' Recovered',
          borderColor: color.recovered,
          backgroundColor: bg.recovered,
          fill: true,
        }, { 
          data: Object.values(globalData.deaths),
          label: ' Deaths',
          borderColor: color.deaths,
          backgroundColor: bg.deaths,
          fill: true,
        }],
      }}
      options={{
        title: { display: true, text: 'Toggle different type of cases' },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: data => data.toLocaleString(),
            },
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: { month: 'MMM YYYY' },
            }
          }]
        },
        tooltips: {
          mode: 'index',
          ...tooltips_style,
          bodySpacing: 8,
          callbacks: { label: (tooltipItem, data) => {
            let label = data.datasets[tooltipItem.datasetIndex].label;
            label += ` : ${tooltipItem.yLabel.toLocaleString()}`;
            return label;
          }},
        },
      }}
    />
  ) : null;

  const barChart = data ? (
    <Bar
      data={{
        labels: ['Confirmed', 'Recovered', 'Deaths'],
        datasets: [{
          label: 'Amount',
          borderWidth: 1.5,
          borderColor: [color.confirmed, color.recovered, color.deaths],
          backgroundColor: [bg.confirmed, bg.recovered, bg.deaths],
          data: [cases, recovered, deaths],
        }],
      }}
      options={{
        legend: { display: false },
        // title: { display: true, text: `Current state in ${country}` },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: data => data.toLocaleString(),
            },
          }]
        },
        tooltips: {
          ...tooltips_style,
          callbacks: { label: (tooltipItem) => (
            ' Amount : ' + tooltipItem.yLabel.toLocaleString()
          )},
        },
      }}
    />
  ) : null;

  return (
    <div className={styles.container}>
      {/* {country && country !== 'Worldwide' ? barChart : lineChart} */}
      {country ? barChart : lineChart}
    </div>
  );
};

export default Chart;