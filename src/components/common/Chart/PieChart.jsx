import React from 'react';
import { color, tooltips } from './chartConfig';
import { Doughnut } from 'react-chartjs-2';

const PieChart = ({ data: { active, cases, recovered, deaths } }) => {
  const data_source = cases && {
    labels: [' Active', ' Recovered', ' Deaths'],
    datasets: [{
      borderColor: '#121212',
      data: [active, recovered, deaths],
      backgroundColor: [color.active, color.recovered, color.deaths],
    }],
  };

  const options = {
    legend: { display: false },
    tooltips: {
      ...tooltips,
      bodyAlign: 'center',
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const currentValue = dataset.data[tooltipItem.index];
          return (` ${currentValue.toLocaleString()}`);
        },
        title: (tooltipItem, data) => data.labels[tooltipItem[0].index],
      },
    },
  };
  return (
    <>
      {cases && (
        <Doughnut width={50} height={50} data={data_source} options={options} />
      )}
    </>
  );
};

export default PieChart;