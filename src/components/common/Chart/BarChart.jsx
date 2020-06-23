import React from 'react';
import { color, ticks, ticks_amount, gridLines } from './chartConfig';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data: { cases, active, recovered, deaths } }) => {
  const data_source = cases && {
    labels: ['Confirmed', 'Active', 'Recovered', 'Deaths'],
    datasets: [{
      label: 'Amount',
      barThickness: 48,
      backgroundColor: [color.confirmed, color.active, color.recovered, color.deaths],
      data: [cases, active, recovered, deaths],
    }],
  };

  const options = {
    legend: { display: false },
    scales: {
      xAxes: [{ gridLines, ticks }],
      yAxes: [{ gridLines, ticks: ticks_amount }],
    },
    tooltips: { enabled: false },
  };

  return <>{cases && <Bar data={data_source} options={options} />}</>;
};

export default BarChart;