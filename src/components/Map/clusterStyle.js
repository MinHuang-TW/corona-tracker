export const setOpacity = (zoom) => {
  if (zoom <= 1) {
    return {
      opacity: 0.175,
      strokeOpacity: 0,
    };
  } else if (zoom > 1 && zoom <= 2) {
    return {
      opacity: 0.3,
      strokeOpacity: 0.5,
    };
  } else {
    return {
      opacity: 0.6,
      strokeOpacity: 1,
    };
  }
};

export const clusterRadius = [
  'step',
  ['get', 'cases'],
  2.5,
  50, 5,
  100, 7.5,
  500, 10,
  1000, 12.5,
  2500, 15,
  5000, 16,
  10000, 18,
  25000, 20,
  50000, 22,
  75000, 24,
  100000, 26,
  150000, 28,
  200000, 30,
  250000, 32,
  300000, 34,
  350000, 36,
];