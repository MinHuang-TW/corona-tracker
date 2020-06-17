export const color = {
  confirmed: '#CF6679',
  recovered: '#03DAC5',
  deaths: '#BB86FC',
};

export const background = {
  confirmed: '#CF6679',
  recovered: '#03DAC5',
  deaths: '#BB86FC',
};

export const gridLines = {
  drawOnChartArea: false,
  color: 'rgba(255, 255, 255, 0.38)',
  tickMarkLength: 5,
};

export const ticks = { 
  padding: 8, 
  fontColor: 'rgba(255, 255, 255, 0.38)',
};

export const ticks_amount = {
  ...ticks,
  userCallback: (amount) => {
    if (amount > 999999) return (amount / 1000000) + ' M';
    else if (amount > 999) return (amount / 1000) + ' K';
    else return amount;
    // return amount.toLocaleString();
  },
};

export const tooltips = {
  titleFontSize: 16,
  titleMarginBottom: 16,
  xPadding: 16,
  yPadding: 16,
};

export const line_datasets = {
  borderWidth: 2,
  fill: false,
  hitRadius: 5,
  hoverRadius: 4,
  radius: 0,
};

export const drawHoverLine = (chart) => {
  if (chart.tooltip._active && chart.tooltip._active.length) {
    const activePoint = chart.controller.tooltip._active[0];
    const ctx = chart.ctx;
    const x = activePoint.tooltipPosition().x;
    const topY = chart.scales['y-axis-0'].top;
    const bottomY = chart.scales['y-axis-0'].bottom;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();
  }
};
