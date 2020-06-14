import React from 'react';
import {
  color, background as bg,
  ticks, ticks_amount,
  tooltips,
  gridLines,
} from './chartConfig';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ country, data: { cases, recovered, deaths } }) => {
  const data_source = cases && {
    labels: ['Confirmed', 'Recovered', 'Deaths'],
    datasets: [{
      label: 'Amount',
      borderWidth: 1.5,
      borderColor: [color.confirmed, color.recovered, color.deaths],
      backgroundColor: [bg.confirmed, bg.recovered, bg.deaths],
      data: [cases, recovered, deaths],
    }],
  };

  const options = {
    legend: { display: false },
    scales: {
      xAxes: [{ gridLines, ticks }],
      yAxes: [{
        gridLines,
        ticks: ticks_amount,
        scaleLabel: {
          display: true,
          fontStyle: 'bold',
          labelString: `${country && country.name !== 'Worldwide' 
            ? 'Cases in ' + country.name : 'Global Cases'
          }`,
        },
      }],
    },
    tooltips: {
      ...tooltips,
      callbacks: {
        label: (tooltipItem) =>
          ' Amount : ' + tooltipItem.yLabel.toLocaleString(),
      },
    },
  };

  return <>{cases && <Bar data={data_source} options={options} />}</>;
};

export default BarChart;