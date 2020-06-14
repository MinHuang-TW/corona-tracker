import React, { useEffect } from 'react';
import { 
  gridLines, 
  tooltips, 
  ticks, ticks_amount, 
  line_datasets, 
  drawHoverLine 
} from './chartConfig';
import { Chart, Line } from 'react-chartjs-2';
import moment from 'moment';

const LineChart = ({ selectedCountries }) => {
  moment.suppressDeprecationWarnings = true;
  const hasHistoryData = selectedCountries.length;
  const timeline = hasHistoryData && selectedCountries[0].timeline.cases;

  const colorPalette = [
    'rgba(139, 0, 0)', '#c45850', '#e8c3b9', 
    '#3cba9f', '#3e95cd', '#003f5c', '#8e5ea2',
    // '#982428', '#c1241c', '#bdbcc0', '#6f4f4d', '#391b1c',
  ];

  const datasets = hasHistoryData ? selectedCountries
    .map(({ name, timeline }, index) => ({
      label: ` ${name}`,
      data: timeline.cases,
      color: colorPalette[index],
    })
  ) : [];

  const data = {
    labels: Object.keys(timeline).map((date) =>
      moment(new Date(date)).format('MMMM D, YYYY')
    ),
    datasets: datasets.map(({ label, data, color }) => ({
      label,
      data: Object.values(data),
      borderColor: color,
      backgroundColor: color,
      ...line_datasets,
    })),
  };

  const options = {
    // responsive: false,
    // maintainAspectRatio: false,
    // aspectRatio: 1,
    layout: {
      padding: {
        bottom: 40,
        right: 8,
      }
    },
    title: {
      display: true,
      text: 'Toggle different countries',
      position: 'bottom',
    },
    scales: {
      yAxes: [{
        gridLines,
        ticks: ticks_amount,
        scaleLabel: {
          display: true,
          fontStyle: 'bold',
          labelString: 'Confirmed Cases',
        },
      }],
      xAxes: [{
        gridLines,
        ticks,
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: { month: 'MMM YYYY' },
        },
      }],
    },
    tooltips: {
      mode: 'index',
      bodySpacing: 8,
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.datasets[tooltipItem.datasetIndex].label;
          return (label += ` : ${tooltipItem.yLabel.toLocaleString()}`);
        },
      },
      ...tooltips,
    },
    legend: {
      position: 'bottom',
      labels: { 
        boxWidth: 12,
        fontStyle: 'bold', 
      },
      onHover: (e) => (e.target.style.cursor = 'pointer'),
    },
    hover: {
      onHover: function (e) {
        const point = this.getElementAtEvent(e);
        if (point.length) e.target.style.cursor = 'pointer';
        else e.target.style.cursor = 'default';
      },
    },
  };

  useEffect(() => {
    Chart.pluginService.register({
      afterDraw: (chart) => {
        if (chart.config.type !== 'line') return;
        drawHoverLine(chart);
      },
    });
  }, []);

  return (
    <>
      {hasHistoryData 
        ? (<Line height={300} data={data} options={options} />)
        : null}
    </>
  );
};

export default LineChart;