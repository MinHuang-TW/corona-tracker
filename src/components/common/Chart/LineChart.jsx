import React, { useState, useEffect, useCallback } from 'react';
import { gridLines, tooltips, ticks, ticks_amount, line_datasets, drawHoverLine } from './chartConfig';
import { Chart, Line } from 'react-chartjs-2';
import moment from 'moment';

const LineChart = ({ selectedCountries }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const hasHistoryData = selectedCountries.length;
  const timeline = hasHistoryData && selectedCountries[0].timeline.cases;
  const colorPalette = ['#c45850', '#e8c3b9', '#3cba9f', '#3e95cd', '#8e5ea2'];
  moment.suppressDeprecationWarnings = true;

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
    layout: {
      padding: {
        bottom: windowWidth < 450 ? 48 : 16,
        top: 8,
        right: 8,
      }
    },
    title: {
      display: true,
      text: 'Toggle different countries',
      position: 'bottom',
      fontStyle: 'normal',
    },
    scales: {
      yAxes: [{
        gridLines,
        ticks: ticks_amount,
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
      yAlign: windowWidth < 400 && 'top',
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

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    Chart.pluginService.register({
      afterDraw: (chart) => {
        if (chart.config.type !== 'line') return;
        drawHoverLine(chart);
      },
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [handleResize]);

  return (
    <>
      {hasHistoryData 
        ? (<Line 
            height={windowWidth < 450 ? 300 : 180} 
            data={data} 
            options={options} 
          />)
        : null}
    </>
  );
};

export default LineChart;