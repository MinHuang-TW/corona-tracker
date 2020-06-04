import React, { useState, useEffect } from 'react';
import { fetchDailyData, fetchData } from '../../api';
import { Line, Bar } from 'react-chartjs-2';
import moment from 'moment';
import styles from './Chart.module.css';

const Chart = ({ data: { confirmed, recovered, deaths }, country }) => {
  const [dailyData, setDailyData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDailyData();
      setData(await fetchData());
      setDailyData(data);
    };
    getData();
  }, []);

  const lineChart = dailyData.length ? (
    <Line
      data={{
        labels: dailyData.map(({ date }) => moment(date)),
        datasets: [{
          data: dailyData.map(({ confirmed }) => confirmed),
          label: 'Confirmed',
          borderColor: 'rgba(139, 0, 0)',
          backgroundColor: 'rgba(139, 0, 0, 0.2)',
          fill: true,
        }, {
          data: dailyData.map(({ deaths }) => deaths),
          label: 'Deaths',
          borderColor: 'rgba(34, 34, 34)',
          backgroundColor: 'rgba(34, 34, 34, 0.5)',
          fill: true,
        }],
      }}
      options={{
        // legend: {
        //   position: 'bottom',
        // },
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
              displayFormats: {
                month: 'MMM YYYY'
              },
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              let label = data.datasets[tooltipItem.datasetIndex].label;
              label += `: ${tooltipItem.yLabel.toLocaleString()}`;
              return label;
            }
          },
        },
      }}
    />
  ) : null;

  const barChart = data ? (
    <Bar
      data={{
        labels: ['Confirmed', 'Recovered', 'Deaths'],
        datasets: [
          {
            label: 'Amount',
            borderWidth: 1.5,
            borderColor: [
              'rgba(139, 0, 0)', 
              'rgba(73,192,182)', 
              'rgba(34, 34, 34)',
            ],
            backgroundColor: [
              'rgba(139, 0, 0, 0.2)', 
              'rgba(73,192,182, 0.2)', 
              'rgba(34, 34, 34, 0.2)',
            ],
            data: [confirmed, recovered, deaths],
          },
        ],
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
          callbacks: {
            label: (tooltipItem, data) => {
              return ' Amount: ' + tooltipItem.yLabel.toLocaleString();
            },
          },
        },
      }}
    />
  ) : null;

  return (
    <div className={styles.container}>{country ? barChart : lineChart}</div>
  );
};

export default Chart;
