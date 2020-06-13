export const color = {
  confirmed: 'rgba(139, 0, 0)',
  recovered: 'rgba(73,192,182)',
  deaths: 'rgba(34, 34, 34)',
};

export const background = {
  confirmed: 'rgba(139, 0, 0, 0.2)',
  recovered: 'rgba(73,192,182, 0.2)',
  deaths: 'rgba(34, 34, 34, 0.2)',
};

export const gridLines = {
  drawOnChartArea: false,
  color: 'rgb(158, 158, 158)',
  tickMarkLength: 5,
};

export const ticks = { padding: 8 };

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
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();
  }
};
