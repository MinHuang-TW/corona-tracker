export const capitalize = (str, lower = false) => {
  return (lower ? str.toLowerCase() : str)
    .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}

export const getRatio = (amount, total) => {
  if (amount === 0) return 0;
  return parseFloat(amount / total * 100);
};