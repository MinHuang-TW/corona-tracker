export const capitalize = (str, lower = false) => {
  return (lower ? str.toLowerCase() : str)
    .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
};

export const getRatio = (amount, total) => {
  if (amount === 0) return 0;
  return parseFloat(amount / total * 100);
};

export const sortLists = (a, b, item, status) => {
  let A = (item === 'name') ? a.name : a.data[item];
  let B = (item === 'name') ? b.name : b.data[item];
  if (status) return (A < B) ? -1 : (B > A) ? 1 : 0;
  return (A > B) ? -1 : (B < A) ? 1 : 0;
};